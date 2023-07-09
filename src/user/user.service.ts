import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { AccessToken } from './user.type';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}
    
    async getAuthenticated(getUserEmail: CreateUserInput): Promise<AccessToken> {
        const { email } = getUserEmail;
        const existUser = await this.repository.findOneBy({email})

        if(!existUser) {
            throw new NotFoundException('Email not found')
        }

        const payload = {email};
        const accessToken = await this.jwtService.signAsync(payload);

        return {accessToken};
    }
    
    async createUser(createUserInput: CreateUserInput): Promise<AccessToken> {
        try {
            const { email } = createUserInput;
            const user = new User();
            user.email = email;
            await user.save();

            const payload = {email};
            const accessToken = await this.jwtService.signAsync(payload);
            return {accessToken}

        } catch (error) {
            if(error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('User already exist')
            }

            throw new InternalServerErrorException();
        }

    }

    async getUsers(): Promise<User[]> {
        return this.repository.find();
    }
}
