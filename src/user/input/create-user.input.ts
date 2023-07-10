import { Field, ObjectType} from 'type-graphql'

@ObjectType()
export class CreateUserInput {
    @Field()
    readonly email: string;
}