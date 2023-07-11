import { Test } from '@nestjs/testing';
import { TodosResolver } from './todos.resolver';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodosService } from './todos.service';
import { User } from 'src/user/user.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { Todo } from './todo.entity';
import { DeleteTodoInput } from './dto/delete-doto.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { UpdateTodoOrderInput } from './dto/update-todo-order.dto';

const mockTodoService = () => ({
    createTodo: jest.fn(),

    deleteTodo: jest.fn(),

    updateTodo: jest.fn(),

    updateTodoOrder: jest.fn(),

    getAllTodos: jest.fn().mockResolvedValue([{id: 1, content: 'dummy content', order: 2, userId: 3} as Todo]),

    getMyTodos: jest.fn()
});

describe('Todo Resolver', () => {
    let todoResolver: TodosResolver;
    let todoService: TodosService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                TodosResolver,
                {
                    provide: TodosService,
                    useFactory: mockTodoService
                }
            ],

        }).compile();

        todoResolver = moduleRef.get<TodosResolver>(TodosResolver);
        todoService = moduleRef.get<TodosService>(TodosService);
    })


    describe('getTodos', () => {
        it('return list of todos', async () => {
            const mockTodos = await todoService.getAllTodos();
            const result = await todoResolver.getTodos()

            expect(todoService.getAllTodos).toHaveBeenCalled();
            expect(result).toEqual(mockTodos)
        })
    })
})