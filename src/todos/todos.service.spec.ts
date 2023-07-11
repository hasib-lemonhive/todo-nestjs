import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from 'src/user/user.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { DeleteTodoInput } from './dto/delete-doto.input';
import { UpdateTodoOrderInput } from './dto/update-todo-order.dto';

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
const mockTodo: Todo = {id: 1, content: 'dummy content', order: 100, userId: 1, createdAt: new Date(), updatedAt: new Date()} as Todo;

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
            const mockCreateTodoInput: CreateTodoInput = {content: 'dummy content'}
            
            todoRepository.create = jest.fn().mockResolvedValue(mockTodo);
            todoRepository.save = jest.fn().mockResolvedValue(mockTodo);
            const result = await todoService.createTodo(mockCreateTodoInput, mockUser);

            expect(todoRepository.create).toHaveBeenCalled();
            expect(todoRepository.maximum).toBeCalledWith('order', {userId: mockUser.id});
            expect(todoRepository.save).toHaveBeenCalled();
            expect(result).toEqual(mockTodo)
        })

        it('create the first todo', async () => {
            const mockCreateTodoInput: CreateTodoInput = {content: 'dummy content..'}
            const TODO_FIRST_ORDER = 100;

            todoRepository.create = jest.fn().mockResolvedValue(mockTodo);
            todoRepository.save = jest.fn().mockResolvedValue({...mockTodo, order: TODO_FIRST_ORDER});
            todoRepository.maximum = jest.fn().mockResolvedValue(null);

            expect(jest.spyOn(todoService, 'createTodo')).not.toHaveBeenCalled()
            const result = await todoService.createTodo(mockCreateTodoInput, mockUser);
            expect(result.order).toEqual(TODO_FIRST_ORDER);
        })

        it('create second todo', async () => {
            const mockCreateTodoInput: CreateTodoInput = {content: 'dummy content..'}
            const MAX_ORDER = 500;

            todoRepository.create = jest.fn().mockResolvedValue(mockTodo);
            todoRepository.save = jest.fn().mockResolvedValue({...mockTodo, order: MAX_ORDER + mockTodo.order});
            todoRepository.maximum = jest.fn().mockResolvedValue(MAX_ORDER);

            expect(jest.spyOn(todoService, 'createTodo')).not.toHaveBeenCalled()
            const result = await todoService.createTodo(mockCreateTodoInput, mockUser);
            expect(result.order).toEqual(MAX_ORDER + mockTodo.order);
        })
    })

    describe('updateTodo', () => {
        it('update todo with given input', async () => {
            const mockUpdateTodoInput: UpdateTodoInput = { content: 'updated content', id: mockTodo.id };

            todoRepository.findOneBy = jest.fn().mockResolvedValue({...mockTodo});
            const result = await todoService.updateTodo(mockUpdateTodoInput, mockUser);

            expect(todoRepository.findOneBy).toHaveBeenCalledWith({id: mockTodo.id, userId: mockUser.id});
            expect(todoRepository.update).toHaveBeenCalledWith(mockTodo.id, {...mockTodo, content: mockUpdateTodoInput.content});
            expect(result).toEqual({...mockTodo, content: mockUpdateTodoInput.content})
        })

        it('Throw error if given id not found', () => {
            const mockUpdateTodoInput: UpdateTodoInput = { content: 'updated content', id: mockTodo.id };

            todoRepository.findOneBy = jest.fn().mockResolvedValue(null);
            expect(todoService.updateTodo(mockUpdateTodoInput, mockUser)).rejects.toThrow();
        })

    })

    describe('deleteTodo', () => {
        it('delete todo by given id', async () => {
            const mockDeleteTodoInput: DeleteTodoInput = { id: 2};

            todoRepository.delete = jest.fn().mockResolvedValue({affected: 1});
            const result = await todoService.deleteTodo(mockDeleteTodoInput, mockUser);

            expect(result).toEqual(true);
        })

        it('return false if given id not found', async () => {
            const mockDeleteTodoInput: DeleteTodoInput = { id: 2};

            todoRepository.delete = jest.fn().mockResolvedValue({affected: 0});
            const result = await todoService.deleteTodo(mockDeleteTodoInput, mockUser);

            expect(result).toEqual(false);
        })
    })

    describe('updateTodoOrder', () => {
        it('throw error if prevId and nextId is null', async () => {
            const mockUpdateTodoOrderInput:UpdateTodoOrderInput = {id: 1, nextId: null, prevId: null};

            expect(todoService.updateTodoOrder(mockUpdateTodoOrderInput, mockUser)).rejects.toThrow(NotAcceptableException);
        })

        it('throw error if todo is not found', async () => {
            const mockUpdateTodoOrderInput:UpdateTodoOrderInput = {id: 1, nextId: 2, prevId: 3};
            todoRepository.findOneBy = jest.fn().mockResolvedValue(null)

            expect(todoService.updateTodoOrder(mockUpdateTodoOrderInput, mockUser)).rejects.toThrow(NotFoundException);
        })

        it('throw error if nextId or prevId is provided but not found any todo with the provided id', async () => {
            const mockUpdateTodoOrderInput:UpdateTodoOrderInput = {id: 1, nextId: 2, prevId: 3};
            jest.spyOn(todoRepository, 'findOneBy')
            .mockResolvedValueOnce(mockTodo)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null)

            expect(todoService.updateTodoOrder(mockUpdateTodoOrderInput, mockUser)).rejects.toThrow(NotFoundException);
        })

        it('get the most least order todo', async () => {
            const MOST_LEAST_TODO_ORDER = 100;
            const mockUpdateTodoOrderInput: UpdateTodoOrderInput = {id: 1, nextId: 2, prevId: null};

            todoRepository.minimum = jest.fn().mockResolvedValue(MOST_LEAST_TODO_ORDER);

            jest.spyOn(todoRepository, 'findOneBy')
            .mockResolvedValueOnce({...mockTodo, order: 400} as Todo) // todoToMove
            .mockResolvedValueOnce({...mockTodo, id: 2} as Todo) // nextTodo

            const result = await todoService.updateTodoOrder(mockUpdateTodoOrderInput, mockUser);

            expect(todoRepository.minimum).toBeCalled()
            expect(todoRepository.update).toHaveBeenCalledWith(mockTodo.id, {...mockTodo, order: result.order}) 
        })

        it('get the most highest order todo', async () => {
            const MOST_HIGHEST_TODO_ORDER = 900;
            const mockUpdateTodoOrderInput: UpdateTodoOrderInput = {id: 1, nextId: null, prevId: 3};

            todoRepository.maximum = jest.fn().mockResolvedValue(MOST_HIGHEST_TODO_ORDER);

            jest.spyOn(todoRepository, 'findOneBy')
            .mockResolvedValueOnce({...mockTodo} as Todo) // todoToMove
            .mockResolvedValueOnce({...mockTodo, order: 900, id: 3} as Todo) // preViousTodo

            const result = await todoService.updateTodoOrder(mockUpdateTodoOrderInput, mockUser);

            expect(todoRepository.maximum).toBeCalled()
            expect(todoRepository.update).toHaveBeenCalledWith(mockTodo.id, {...mockTodo, order: result.order}) 
        })

        it('place the selected todo between previous and next todo', async () => {
            const mockUpdateTodoOrderInput:UpdateTodoOrderInput = {id: 1, nextId: 2, prevId: 3};

            jest.spyOn(todoRepository, 'findOneBy')
            .mockResolvedValueOnce({...mockTodo} as Todo)
            .mockResolvedValueOnce({...mockTodo, id: 2, order: 200} as Todo)
            .mockResolvedValueOnce({...mockTodo, id: 3, order: 400} as Todo);

            const result = await todoService.updateTodoOrder(mockUpdateTodoOrderInput, mockUser)
            
            expect(todoRepository.update).toHaveBeenCalledWith(mockTodo.id, { order: result.order })
        })
    })

})