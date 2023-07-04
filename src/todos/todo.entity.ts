import { User } from 'src/user/user.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, Generated } from 'typeorm';

@Entity()
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(type => User, user => user.todos, {eager: false})
  user: User;

  @Column()
  userId: number;
}
