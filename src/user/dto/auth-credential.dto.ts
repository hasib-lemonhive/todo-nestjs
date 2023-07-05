import { Field, ObjectType} from 'type-graphql'

@ObjectType()
export class AuthCredentialDto {
    @Field()
    readonly email: string;
}