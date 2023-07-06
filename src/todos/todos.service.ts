import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from 'src/user/user.entity';
import { UpdateTodoOrderDto } from './dto/update-todo-order.dto';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo) 
        private repository: Repository<Todo>
    ) {}

    async getMyTodos(user: User): Promise<Todo[]> {
        return this.repository.find({where: {userId: user.id}});
    }

    async getAllTodos(): Promise<Todo[]> {
        return this.repository.find();
    }

    async createTodo(createTodoInput: CreateTodoInput, user: User): Promise<Todo> {
        const { content } = createTodoInput;

        const todo = new Todo();
        todo.content = content;
        todo.user = user;
        
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

    async updateTodoOrder(updateTodoOptions: UpdateTodoOrderDto, user: User) {
        const { id, prevTodoId} = updateTodoOptions;

        const todoToMove = await this.repository.findOneBy({id: parseInt(id), userId: user.id});
        const previousTodo = await this.repository.findOneBy({id: parseInt(prevTodoId), userId: user.id});

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