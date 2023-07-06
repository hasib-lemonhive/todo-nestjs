import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from 'src/user/user.entity';
import { UpdateTodoOrderInput } from './dto/update-todo-order.dto';
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
    
    // const largestPrice = await getConnection()
    // .createQueryBuilder()
    // .select('MAX(Price)', 'LargestPrice')
    // .from(Products, 'products')
    // .getRawOne();

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

        const { maxOrder } = await this.repository
        .createQueryBuilder('todo')
        .select('MAX(todo.order)', 'maxOrder')
        .getRawOne();

        if(maxOrder !== null) {
            todo.order = maxOrder + 1;
        } else { 
            todo.order = 1.0;
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

    async updateTodoOrder(updateTodoOptions: UpdateTodoOrderInput, user: User) {
        const { id, prevId, nextId} = updateTodoOptions;
        console.log('type of id => ', typeof id);

        const todoToMove = await this.repository.findOneBy({id, userId: user.id});
        const previousTodo = await this.repository.findOneBy({id: prevId, userId: user.id});
        const nextTodo = await this.repository.findOneBy({id: nextId, userId: user.id});

        if(!todoToMove || !todoToMove || !previousTodo) {
            throw new NotFoundException();
        }

        const getAverage = (previousTodo.order + nextTodo.order) / 2;
        console.log('get average => ', getAverage)

        return this.repository.createQueryBuilder()
        .update(Todo)
        .set({order: getAverage})
        .where('id > :id', {id})
        .execute();
    }
}