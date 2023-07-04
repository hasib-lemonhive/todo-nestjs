import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/user/jwt-strategy';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UserModule],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
