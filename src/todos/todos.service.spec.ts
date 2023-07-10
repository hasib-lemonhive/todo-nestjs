import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

export type MockType<T> = {
    [P in keyof T]?: jest.Mock<object>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    find: jest.fn(entity => entity),
    createQueryBuilder: jest.fn(entity => entity),
    minimum: jest.fn(entity => entity),
    maximum: jest.fn(entity => entity),
    findOneBy: jest.fn(entity => entity),
    update: jest.fn(entity => entity),
    delete: jest.fn(entity => entity),
}));


describe('Todo Service', () => {
    let service: TodosService;
    let repositoryMock: MockType<Repository<Todo>>

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [TodosService, {
                provide: getRepositoryToken(Todo),
                useFactory: repositoryMockFactory,
            }]
        }).compile();

        service = moduleRef.get<TodosService>(TodosService);
        repositoryMock = moduleRef.get(getRepositoryToken(Todo))
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    it('getTodos', () => {
        const todos = Promise.resolve([{id: 1, content: 'test content', order: 1}]);
        repositoryMock.find.mockReturnValue(todos);

        expect(service.getAllTodos()).toEqual(todos);
    })
})