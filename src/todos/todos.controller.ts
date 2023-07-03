import { Controller, Get } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todo')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get('/my-todos')
  getMyTodos(): string {
    return this.todosService.getMyTodos()
  }

  @Get('/all-todos')
  getAllTodos(): string {
    return this.todosService.getAllTodos();
  }
}
