import { Field, InputType} from '@nestjs/graphql'
import { IsString } from 'class-validator';

@InputType()
export class CreateTodoInput {
    @Field()
    @IsString()
    readonly content: string;
}