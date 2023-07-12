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

const mockTodo: Todo = {id: 1, content: 'dummy content', order: 100, userId: 1, createdAt: new Date(), updatedAt: new Date()} as Todo;
const mockUser: User = {email: 'test@mail.com', id: 1} as User; 

const testfn = (): string => {
    return 'asdf';
}

const mockTodoService: () => Omit<TodosService, "repository"> = () => ({
    createTodo: jest.fn(),

    deleteTodo: jest.fn(),

    updateTodo: jest.fn(),

    updateTodoOrder: jest.fn(),

    getAllTodos: jest.fn().mockResolvedValue([mockTodo, mockTodo]),

    getMyTodos: jest.fn().mockResolvedValue([mockTodo, mockTodo])
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
        it('returns list of todos', async () => {
            await todoService.getAllTodos();
            await todoResolver.getTodos()

            expect(todoService.getAllTodos).toHaveBeenCalled();
        })
    })

    describe('getMyTodos', () => {
        it('returns list of todos by user', async () => {
            const mockContext = {req: {user: mockUser}}
            await todoService.getMyTodos(mockUser);
            await todoResolver.getMyTodos(mockContext);

            expect(todoService.getMyTodos).toHaveBeenCalledWith(mockUser);
        })
    })

    describe('createTodo', () => {
        it('create a todo', async () => {
            const mockContext = {req: {user: mockUser}}
            const mockCreateTodoInput: CreateTodoInput = {content: 'dummy todo'};

            jest.spyOn(todoService, 'createTodo').mockResolvedValue(mockTodo)
            await todoResolver.createTodo(mockCreateTodoInput, mockContext);

            expect(todoService.createTodo).toHaveBeenCalledWith(mockCreateTodoInput, mockUser);
        })
    })

    describe('updateTodo', () => {
        it('update todo', async () => {
            const mockContext = {req: {user: mockUser}}
            const mockUpdateTodoInput: UpdateTodoInput = {content: 'updated content', id: 2};
            const mockUpdatedTodo = {...mockTodo, content: mockUpdateTodoInput.content, id: mockUpdateTodoInput.id} as Todo;

            jest.spyOn(todoService, 'updateTodo').mockResolvedValue(mockUpdatedTodo)
            await todoResolver.updateTodo(mockUpdateTodoInput, mockContext);

            expect(todoService.updateTodo).toHaveBeenCalledWith(mockUpdateTodoInput, mockUser);
        })
    })

    describe('updateTodoOrder', () => {
        it('update todo order', async () => {
            const mockContext = {req: {user: mockUser}}
            const mockUpdateTodoOrderInput: UpdateTodoOrderInput = {id: 2, nextId: 4, prevId: 6};

            jest.spyOn(todoService, 'updateTodoOrder').mockResolvedValue(mockTodo);
            await todoResolver.updateTodoOrder(mockUpdateTodoOrderInput, mockContext);

            expect(todoService.updateTodoOrder).toHaveBeenCalledWith(mockUpdateTodoOrderInput, mockUser);
        })
    })

    describe('deleteTodo', () => {
        it('delete single todo by given id', async () => {
            const mockContext = {req: {user: mockUser}}
            const mockDeleteTodoInput: DeleteTodoInput = {id: 2};

            jest.spyOn(todoService, 'deleteTodo').mockResolvedValue(true);
            await todoResolver.deleteTodo(mockDeleteTodoInput, mockContext);

            expect(todoService.deleteTodo).toHaveBeenCalledWith(mockDeleteTodoInput, mockUser);
        })
    })
})