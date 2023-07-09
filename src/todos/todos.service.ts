import { Get, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from 'src/user/user.entity';
import { UpdateTodoOrderInput } from './dto/update-todo-order.dto';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { DeleteTodoInput } from './dto/delete-doto.input';

@Injectable()
export class TodosService {
  constructor(
        @InjectRepository(Todo) 
        private repository: Repository<Todo>
    ) {}

    async getMyTodos(user: User): Promise<Todo[]> {
        return this.repository.find({where: {userId: user.id}, order: {order: 'ASC'}});
    }

    async getAllTodos(): Promise<Todo[]> {
        return this.repository.createQueryBuilder('todo')
        .orderBy('todo.order', 'ASC')
        .getMany();
    }

    async createTodo(createTodoInput: CreateTodoInput, user: User): Promise<Todo> {
        const { content } = createTodoInput;
        const todo = new Todo();
        todo.content = content;
        todo.user = user;

        const maxOrder: number | null = await this.repository
        .maximum('order', {userId: user.id})

        if(maxOrder !== null) {
            todo.order = maxOrder + 100;
        } else { 
            todo.order = 100;
        }

        await todo.save();
        delete todo.user;
        return todo;
    }

    async updateTodo(updateTodoInput: UpdateTodoInput, user: User) {
        const {id, content} = updateTodoInput;
        const foundTodo = await this.repository.findOneBy({id: id, userId: user.id});

        if(!foundTodo) {
            throw new NotFoundException(`No todo found by id:${id}`);
        }

        Object.assign(foundTodo, {content: content});
        await this.repository.update(foundTodo.id, foundTodo);
        return foundTodo;
    }

    async deleteTodo(deleteTodoInput: DeleteTodoInput, user: User) {
        const { id } = deleteTodoInput;
        const deleteResult = await this.repository.delete({id, userId: user.id});

        if(deleteResult.affected === 1) return true;
        return false;
    }

    async updateTodoOrder(updateTodoOptions: UpdateTodoOrderInput, user: User): Promise<Todo> {
        const { id, prevId, nextId} = updateTodoOptions;
        
        if(!prevId && !nextId) {
            throw new NotAcceptableException('prevId and nextId both can\'t be null');
        }

        const todoToMove = await this.repository.findOneBy({id, userId: user.id});
        
        if(!todoToMove) {
            throw new NotFoundException(`id: ${id} not found.`);
        }

        const previousTodo = prevId ? await this.repository.findOneBy({id: prevId, userId: user.id}) : null;
        const nextTodo = nextId ? await this.repository.findOneBy({id: nextId, userId: user.id}) : null;

        if(prevId && !previousTodo) throw new NotFoundException(`prevId: ${prevId} not found.`);
        if(nextId && !nextTodo) throw new NotFoundException(`nextId: ${nextId} not found.`);

        // handle most top item order
        if(nextTodo && !previousTodo) {
            // Check nextTodo is the most top item
            const minOrder: number | null = await this.repository
            .minimum('order', {userId: user.id})

            if(minOrder !== nextTodo.order) throw new NotAcceptableException(`nextId: ${nextId} is not the most top item`);

            todoToMove.order = nextTodo.order / 2;

            await this.repository.update(todoToMove.id, todoToMove);
            return todoToMove;
        }

        // handle most bottom item order
        if(!nextTodo && previousTodo) {
            // Check previousTodo is the most bottom item
            const maxOrder: number | null = await this.repository
            .maximum('order', {userId: user.id})

            if(maxOrder !== previousTodo.order) throw new NotAcceptableException(`prevId: ${prevId} is not the most bottom item`);

            todoToMove.order = previousTodo.order + 100;

            await this.repository.update(todoToMove.id, todoToMove);
            return todoToMove;
        }

        const getAverage = (previousTodo.order + nextTodo.order) / 2;
        todoToMove.order = getAverage;

        await this.repository.update(todoToMove.id, {order: getAverage})
        return todoToMove;
    }
}