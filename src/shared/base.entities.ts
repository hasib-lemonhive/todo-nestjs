import {
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    BaseEntity
  } from 'typeorm';

  import { Field, ObjectType, Int } from '@nestjs/graphql';
  
  @ObjectType()
  export abstract class ExtendedBaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;
  
    @Field()
    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date;
  
  
    @Field()
    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date;
  }
  