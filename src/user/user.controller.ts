import { Controller, Post, Headers, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/authenticate')
    async getAuthenticated(@Headers() authCredential: AuthCredentialDto): Promise<{accessToken: string}> {
        return this.userService.getAuthenticated(authCredential);
    }

    // @Post('/test')
    // @UseGuards(AuthGuard())
    // test(@Req() req) {
    //     console.log(req.user)
    // }
}
