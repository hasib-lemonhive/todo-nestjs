import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
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

    @Query(retunrs => [User])
    getUsers(): Promise<User[]> {
      return this.userService.getUsers();
    }
}