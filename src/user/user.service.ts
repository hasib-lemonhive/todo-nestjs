import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
        private jwtService: JwtService
    ) {}
    
    async getAuthenticated(authCredentialDto: AuthCredentialDto) {
        const { email } = authCredentialDto;
        const existUser = await this.repository.findOneBy({email})

        if(!existUser) {
            const user = new User();
            user.email = email;
            await user.save();
        }

        const payload = {email};
        const accessToken = await this.jwtService.signAsync(payload);

        return {accessToken};

        // try {
        // } catch (error) {
        //     if(error.code === 'ER_DUP_ENTRY') {
        //         throw new ConflictException('User already exist')
        //     }

        //     throw new InternalServerErrorException();
        // }

        // const jwt = await this.jwtService.sign()
    }
}
