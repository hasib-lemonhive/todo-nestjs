import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todo')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get('/my-todos')
  getMyTodos(): string {
    return this.todosService.getMyTodos()
  }

  @Get('/all-todos')
  async getAllTodos() {
    const todos = await this.todosService.getAllTodos();

    return {
      message: todos.length + ' todos',
      todos
    }
  }

  @Post()
  async createTodo(@Body() body: {content: string}) {
    const todo = await this.todosService.createTodo(body.content);

    return {message: 'Created successfully', todo};
  }

  @Patch('/update/:id')
  async updateTodo(@Body() body: {content: string}, @Param('id') id: string) {
    const todo = await this.todosService.updateTodo(id, body.content);
    
    return {message: 'Updated successfully', todo};
  }
}
