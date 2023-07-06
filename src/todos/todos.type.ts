import { ObjectType, Field, ID, Float } from "@nestjs/graphql";

@ObjectType()
export class GetTodosPayload {
  @Field(type => ID)
  id: number;

  @Field()
  content: string;

  @Field(type => Float)
  order: number;
}