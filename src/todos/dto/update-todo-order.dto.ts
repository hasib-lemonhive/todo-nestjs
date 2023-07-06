import { Field, InputType, ID, Int} from '@nestjs/graphql';

@InputType()
export class UpdateTodoOrderInput {
    @Field(type => Int)
    readonly id: number;

    @Field(type => Int)
    readonly prevId: number;

    @Field(type => Int)
    readonly nextId: number;
}