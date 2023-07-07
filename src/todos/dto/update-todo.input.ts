import { Field, InputType, Int} from '@nestjs/graphql'
import { IsString } from 'class-validator';

@InputType()
export class UpdateTodoInput {
    @Field(type => Int)
    readonly id: number;

    @Field()
    @IsString()
    readonly content: string;
}