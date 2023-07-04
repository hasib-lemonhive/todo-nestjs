import { Todo } from 'src/todos/todo.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @OneToMany(type => Todo, todo => todo.user, {eager: true})
  todos: Todo[];
}
