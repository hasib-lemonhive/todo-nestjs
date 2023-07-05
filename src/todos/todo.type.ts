import { ObjectType, Field } from "@nestjs/graphql";
import { UserType } from "src/user/user.type";
import { Int } from "type-graphql";

@ObjectType('Todo')
export class TodoType {
    id: number;

    @Field()
    content: string;
    
    @Field(() => UserType)
    user: UserType;
    
    @Field(() => Int)
    userId: number;
}