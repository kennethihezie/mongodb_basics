import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TransactionDocument = HydratedDocument<Transaction>

@Schema()
export class Transaction{
   @Prop()
   transferId: string

   @Prop()
   amount: number

   @Prop()
   senderAccountId: string

   @Prop()
   receiverAccountId: string
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)