import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
    secret: 'my-secret',
    signOptions: {
      expiresIn: '10h'
    }
  }), 
  TypeOrmModule.forFeature([User])
],
  providers: [UserService, JwtStrategy, UserResolver],
  // controllers: [UserController], TODO: delete controller when resolver implemented
  exports: [JwtStrategy, PassportModule]
})
export class UserModule {}
