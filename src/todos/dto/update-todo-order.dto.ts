import { Field, InputType, ID, Int} from '@nestjs/graphql';

@InputType()
export class UpdateTodoOrderInput {
    @Field(type => Int)
    readonly id: number;

    @Field(type => Int, {nullable: true})
    readonly prevId?: number;

    @Field(type => Int, {nullable: true})
    readonly nextId?: number;
}