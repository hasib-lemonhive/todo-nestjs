import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserType } from "./user.type";
import { AuthGuard } from "@nestjs/passport";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "./guard/gql-auth.guard";
import { UserService } from "./user.service";
import { CreateUserInput } from "./input/create-user.input";

@Resolver(() => UserType)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Mutation(() => UserType)
    createUser(@Args('email') email: string) {
        return {
            id: 1,
            email: 'asdf',
            todos: []
        }
    }
}