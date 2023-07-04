import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from 'src/user/user.entity';
import { UpdateTodoOrderDto } from './dto/update-todo-order.dto';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo) 
        private repository: Repository<Todo>
    ) {}

    async getMyTodos(user: User) {
        const query = this.repository.createQueryBuilder('todo');
        query.where('todo.userId = :userId', {userId: user.id});

        return await query.getMany();
    }

    async getAllTodos() {
        const query = this.repository.createQueryBuilder('todo');
        return await query.getMany();
    }

    async createTodo(content: string, user: User) {
        const todo = new Todo();
        todo.content = content;
        todo.user = user;
        
        await todo.save();

        delete todo.user;
        return todo;
    }

    async updateTodo(id: string, content: string, user: User) {
        const foundTodo = await this.repository.findOneBy({id: parseInt(id), userId: user.id});

        if(!foundTodo) {
            throw new NotFoundException(`No todo found by id:${id}`);
        }

        Object.assign(foundTodo, {content: content});
        await this.repository.update(foundTodo.id, foundTodo);
        return foundTodo;
    }

    async updateTodoOrder(updateTodoOptions: UpdateTodoOrderDto, user: User) {
        const { id, prevTodoId} = updateTodoOptions;

        const todoToMove = await this.repository.findOneBy({id: parseInt(id), userId: user.id});
        const previousTodo = await this.repository.findOneBy({id: parseInt(prevTodoId), userId: user.id});

        console.log('todo to move => ', todoToMove)
        console.log('previous todo => ', previousTodo)

        if(!todoToMove || !previousTodo) {
            throw new NotFoundException();
        }

        await this.repository.createQueryBuilder()
        .update(Todo)
        .set({id: () => 'id + 1'})
        .where('id > :id', {id: previousTodo.id})
        .execute();
        
        await this.repository.createQueryBuilder()
        .update(Todo)
        .set({id: previousTodo.id + 1})
        .where('id = :id', { id: todoToMove.id })
        .execute();
    }
}