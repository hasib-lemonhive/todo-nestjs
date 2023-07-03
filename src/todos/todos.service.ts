import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodosService {
    constructor(@InjectRepository(Todo) private repository: Repository<Todo>) {}

    getMyTodos() {
        return 'getMyTodos';
    }

    getAllTodos() {
        return 'getAllTodos';
    }
}
