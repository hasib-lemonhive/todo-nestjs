import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Generated, BaseEntity } from 'typeorm';

@Entity()
@ObjectType('Todo')
export class Todo extends BaseEntity{
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  content: string;

  @Field(type => User)
  @ManyToOne(type => User, user => user.todos, {eager: false})
  user: User;

  @Field(type => Int)
  @Column()
  userId: number;
}
