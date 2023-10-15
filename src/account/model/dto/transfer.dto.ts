import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class TransferDto {
    @IsString()
    @IsNotEmpty()
    senderAccountId: string

    @IsNumber()
    @IsPositive()
    amount: number

    @IsString()
    @IsNotEmpty()
    receiverAccountId: string

    @IsOptional()
    @IsString()
    transactionRef: string
} 