import { ObjectType, Field, Float, Int } from "@nestjs/graphql";

@ObjectType()
export class GetTodosPayload {
  @Field(type => Int)
  id: number;

  @Field()
  content: string;

  @Field(type => Float)
  order: number;
}