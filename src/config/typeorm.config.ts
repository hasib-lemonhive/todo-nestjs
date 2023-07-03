import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'Password123',
  database: 'todo',
  entities: [__dirname + '/../**/*.entity.ts'],
  synchronize: true,
};
