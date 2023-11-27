import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TransactionDocument = HydratedDocument<Transaction>

@Schema({
   timestamps: true
})
export class Transaction{
   @Prop()
   transferId: string

   @Prop()
   amount: number

   @Prop()
   senderAccountId: string

   @Prop()
   receiverAccountId: string

   @Prop()
   transactionRef: string
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)