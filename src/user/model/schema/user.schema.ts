import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User{
  @Prop()
  name: string

  @Prop()
  roleNumber: number

  @Prop()
  class: number

  @Prop()
  gender: string

  @Prop()
  marks: number
}

export const UserSchema = SchemaFactory.createForClass(User)