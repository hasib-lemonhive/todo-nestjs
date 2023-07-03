import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { TodosModule } from 'src/todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    TodosModule],
  providers: [AppService],
})
export class AppModule {}
