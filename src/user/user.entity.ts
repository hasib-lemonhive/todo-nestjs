import { Todo } from 'src/todos/todo.entity';
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, BaseEntity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@Unique(['email'])
@ObjectType()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  email: string;

  @OneToMany(() => Todo, todo => todo.user, {eager: true})
  @Field(type => [Todo])
  todos: Todo[];
}
