import { Todo } from 'src/todos/todo.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { ID } from 'type-graphql';
import { TodoType } from 'src/todos/todo.type';

@ObjectType('User')
export class UserType {
    @Field(() => ID)
    id: number;
    
    @Field()
    email: string;
    
    @Field(() => [TodoType])
    todos: Todo[];
}
