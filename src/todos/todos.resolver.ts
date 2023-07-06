import { Args, Query, Resolver, Context, Mutation } from "@nestjs/graphql";
import { Todo } from "./todo.entity";
import { TodosService } from "./todos.service";
import { GetTodosPayload } from "./todos.type";
import { Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GqlAuthGuard } from "src/user/guard/gql-auth.guard";
import { User } from "src/user/user.entity";
import { CreateTodoInput } from "./dto/create-todo.input";
import { UpdateTodoInput } from "./dto/update-todo.input";

@Resolver(of => Todo)
export class TodosResolver {
    constructor(private todoService: TodosService){}
    
    @Query(returns => [GetTodosPayload])
    getTodos(): Promise<Todo[]> {
        return this.todoService.getAllTodos();
    }

    @Query(returns => [GetTodosPayload])
    @UseGuards(new GqlAuthGuard())
    getMyTodos(@Context() context): Promise<Todo[]> {
      return this.todoService.getMyTodos(context.req.user as User)
    }

    @Mutation(returns => GetTodosPayload)
    @UseGuards(new GqlAuthGuard())
    createTodo(@Args('data') content: CreateTodoInput, @Context() context): Promise<Todo> {
      return this.todoService.createTodo(content, context.req.user as User)
    }

    @Mutation(returns => GetTodosPayload)
    @UseGuards(new GqlAuthGuard())
    updateTodo(@Args('data') updateTodoInput: UpdateTodoInput, @Context() context): Promise<Todo> {
      return this.todoService.updateTodo(updateTodoInput, context.req.user as User)
    }
}