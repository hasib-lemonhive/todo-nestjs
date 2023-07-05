import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "./guard/gql-auth.guard";
import { UserService } from "./user.service";
import { CreateUserInput } from "./dto/create-user.input";
import { User } from "./user.entity";

@Resolver(of => User)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Query(() => String)
    sayHello(): string {
      return 'Hello World!';
    }

    @Mutation(returns => User)
    createUser(@Args('data') createUserInput: CreateUserInput): Promise<User> {
        return this.userService.createUser(createUserInput);
    }
}