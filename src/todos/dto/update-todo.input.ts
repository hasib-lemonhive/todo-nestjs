import { Field, InputType, ID} from '@nestjs/graphql'
import { IsString } from 'class-validator';

@InputType()
export class UpdateTodoInput {
    @Field(type => ID)
    readonly id: number;

    @Field()
    @IsString()
    readonly content: string;
}