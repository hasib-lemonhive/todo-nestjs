import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo) 
        private repository: Repository<Todo>
    ) {}

    getMyTodos() {
        return 'getMyTodos';
    }

    async getAllTodos() {
        const query = this.repository.createQueryBuilder('todo');
        return await query.getMany();
    }

    async createTodo(content: string) {
        const todo = await this.repository.create({content: content});
        return await todo.save();
    }

    async updateTodo(id: string, content: string) {
        const foundTodo = await this.repository.findOneBy({id: parseInt(id)});

        if(!foundTodo) {
            throw new NotFoundException(`No todo found by id:${id}`);
        }

        Object.assign(foundTodo, {content: content});
        await this.repository.update(foundTodo.id, foundTodo);
        return foundTodo;
    }
}
