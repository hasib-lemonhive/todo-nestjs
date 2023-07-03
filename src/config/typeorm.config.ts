import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test-user',
  password: 'password',
  database: 'todo',
  entities: [__dirname + '/../**/*.entity.ts'],
  synchronize: true,
};
