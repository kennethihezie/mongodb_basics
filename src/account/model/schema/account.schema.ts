import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AccountDocument = HydratedDocument<Account>

@Schema()
export class Account {
   @Prop()
   accountHolder: string

   @Prop()
   balance: number

   @Prop()
   accountId: string
}

export const AccountSchema = SchemaFactory.createForClass(Account)