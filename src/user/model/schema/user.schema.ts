import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, now } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({
  // Includes createdAt and updatedAt to the schema
  timestamps: true,
})
export class User {
  @Prop({ index: 'ascending', unique: 'number'})
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