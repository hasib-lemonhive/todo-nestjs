import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Generated, BaseEntity } from 'typeorm';

@Entity()
@ObjectType('Todo')
export class Todo extends BaseEntity{
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

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
