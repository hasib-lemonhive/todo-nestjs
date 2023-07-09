import { Field, InputType, Int} from '@nestjs/graphql'

@InputType()
export class DeleteTodoInput {
    @Field(type => Int)
    readonly id: number;
}