import { Field, InputType} from '@nestjs/graphql'
import { IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field()
    @IsEmail()
    readonly email: string;
}