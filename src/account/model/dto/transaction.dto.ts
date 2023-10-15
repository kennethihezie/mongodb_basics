import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class TransactionDto {
    @IsString()
    @IsNotEmpty()
    transferId: string

    @IsNumber()
    @IsPositive()
    amount: number

    @IsString()
    @IsNotEmpty()
    senderAccountId: string

    @IsString()
    @IsNotEmpty()
    receiverAccountId: string
}