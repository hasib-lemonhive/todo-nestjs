import { Args, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
// import { UseGuards } from "@nestjs/common";
// import { GqlAuthGuard } from "./guard/gql-auth.guard";
import { UserService } from "./user.service";
import { CreateUserInput } from "./dto/create-user.input";
import { User } from "./user.entity";
import { AccessToken } from "./user.type";

@Resolver(of => User)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Mutation(returns => AccessToken)
    createUser(@Args('data') createUserInput: CreateUserInput): Promise<AccessToken> {
      return this.userService.createUser(createUserInput);
    }

    @Query(returns => AccessToken)
    authenticate(@Args('data') createUserInput: CreateUserInput): Promise<AccessToken> {
      return this.userService.getAuthenticated(createUserInput);
    }
}