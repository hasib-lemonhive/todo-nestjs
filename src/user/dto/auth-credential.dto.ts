import { Field, ObjectType, InputType} from 'type-graphql'

@InputType()
export class AuthCredentialDto {
    @Field()
    readonly email: string;
}