import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTodoOrderDto } from './dto/update-todo-order.dto';

@Controller()
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get('/my-todos')
  @UseGuards(AuthGuard())
  async getMyTodos(@Req() req) {
    const todos = await this.todosService.getMyTodos(req.user)

    return {
      message: todos.length + ' todos',
      todos
    }
  }

  @Get('/all-todos')
  async getAllTodos() {
    const todos = await this.todosService.getAllTodos();

    return {
      message: todos.length + ' todos',
      todos
    }
  }

  @Post('todo')
  @UseGuards(AuthGuard())
  async createTodo(@Body() body: {content: string}, @Req() req) {
    const todo = await this.todosService.createTodo(body.content, req.user);
    
    return {message: 'Created successfully', todo};
  }
  
  @Put('/todo/update/:id')
  @UseGuards(AuthGuard())
  async updateTodo(@Body() body: {content: string}, @Param('id') id: string, @Req() req) {
    const todo = await this.todosService.updateTodo(id, body.content, req.user);
    
    return {message: 'Updated successfully', todo};
  }
  
  @Put('/todo/update-order')
  @UseGuards(AuthGuard())
  async updateTodoOrder(@Body() updateTodoOrderDto: UpdateTodoOrderDto, @Req() req) {
    const todo = await this.todosService.updateTodoOrder(updateTodoOrderDto, req.user);
    
    return {message: 'Updated successfully', todo};
  }


}
