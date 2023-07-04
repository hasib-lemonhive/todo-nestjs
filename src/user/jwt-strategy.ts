import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from 'passport-jwt';
import { JwtPayload } from "./jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('token'), // Extract token from the "token" header
    secretOrKey: 'my-secret',
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super(jwtOptions);
    }

    async validate(payload: JwtPayload) {
        const {email } = payload;
        const user = await this.userRepository.findOneBy({email});

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}