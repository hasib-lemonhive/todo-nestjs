import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { ExtendedBaseEntity } from 'src/shared/base.entities';
import { User } from 'src/user/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
@ObjectType('Todo')
export class Todo extends ExtendedBaseEntity {
  @Field()
  @Column()
  content: string;

  @Field(type => Float)
  @Column({type: 'float'})
  order: number;

  @Field(type => User)
  @ManyToOne(type => User, user => user.todos, {eager: false})
  user: User;

  @Field(type => Int)
  @Column()
  userId: number;
}
