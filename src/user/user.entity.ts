import { Todo } from 'src/todos/todo.entity';
import { Entity, Column, Unique, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { ExtendedBaseEntity } from 'src/shared/base.entities';

@Entity()
@Unique(['email'])
@ObjectType()
export class User extends ExtendedBaseEntity {
  @Column()
  @Field()
  email: string;

  @OneToMany(() => Todo, todo => todo.user, {eager: true})
  @Field(type => [Todo])
  todos: Todo[];
}
