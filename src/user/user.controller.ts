import { Controller, Post, Headers, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/authenticate')
    async getAuthenticated(@Headers() authCredential: AuthCredentialDto): Promise<{accessToken: string}> {
        return this.userService.getAuthenticated(authCredential);
    }

    @Post('/create-user')
    async createUser(@Headers() authCredential: AuthCredentialDto) {
        // await this.userService.createUser(authCredential.email);
        return {
            message: 'User created successfully'
        };
    }
}
