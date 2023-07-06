import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { UserModule } from 'src/user/user.module';
import { TodosResolver } from './todos.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UserModule],
  providers: [TodosService, TodosResolver],
})
export class TodosModule {}
