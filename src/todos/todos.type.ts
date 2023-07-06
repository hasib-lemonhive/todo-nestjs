import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class GetTodosPayload {
  @Field(type => ID)
  id: number;

  @Field()
  content: string;
}