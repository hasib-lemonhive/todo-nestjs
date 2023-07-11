import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from 'src/user/user.entity';
import { CreateTodoInput } from './dto/create-todo.input';

const mockRepository = () => ({
    find: jest.fn(),
    minimum: jest.fn(),
    maximum: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    save: jest.fn()
})

const mockUser: User = {email: 'test@mail.com', id: 1} as User; 
const mockTodo: Todo = {id: 1, content: 'dummy content', order: 2, userId: 1, createdAt: new Date(), updatedAt: new Date()} as Todo;

describe('Todo Service', () => {
    let todoService: TodosService;
    let todoRepository: Repository<Todo>

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [TodosService, {
                provide: getRepositoryToken(Todo),
                useFactory: mockRepository,
            }]
        }).compile();

        todoService = moduleRef.get<TodosService>(TodosService);
        todoRepository = moduleRef.get<Repository<Todo>>(getRepositoryToken(Todo))
    })

    describe('getAllTodos', () => {
        it('Get all task from the repository', async () => {
            todoRepository.find = jest.fn().mockResolvedValue([])
            const result = await todoService.getAllTodos();

            expect(todoRepository.find).toHaveBeenCalled();
            expect(result).toEqual([]);
        })
    })

    describe('getMyTodos', () => {
        it('Get my all task from the repository', async () => {
            const mockTodos: Todo[] = [];
            todoRepository.find = jest.fn().mockResolvedValue(mockTodos)

            const result = await todoService.getMyTodos(mockUser);

            expect(todoRepository.find).toHaveBeenCalledWith({where: {userId: mockUser.id}, order: {order: 'ASC'}});
            expect(result).toEqual(mockTodos);
        })
    })

    describe('createTodo', () => {
        it('create a todo', async () => {
            const mockedCreateTodoInput: CreateTodoInput = {content: 'dummy content'}
            
            todoRepository.create = jest.fn().mockResolvedValue(mockTodo);
            const result = await todoService.createTodo(mockedCreateTodoInput, mockUser);

            expect(todoRepository.create).toHaveBeenCalled();
            expect(todoRepository.maximum).toBeCalledWith('order', {userId: mockUser.id});
            expect(todoRepository.save).toHaveBeenCalled();
            expect(result).toEqual(mockTodo)
        })

        it('create the first todo of an user', async () => {
            const mockedCreateTodoInput: CreateTodoInput = {content: 'dummy content..'}
            const TODO_FIRST_ORDER = 100;

            todoRepository.create = jest.fn().mockResolvedValue(mockTodo);
            todoRepository.maximum = jest.fn().mockResolvedValue(null);

            const result = await todoService.createTodo(mockedCreateTodoInput, mockUser);
            console.log(result);

            expect(result.order).toEqual(TODO_FIRST_ORDER);
        })
    })

})
