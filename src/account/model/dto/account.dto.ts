import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class AccountDto {
    @IsString()
    @IsNotEmpty()
    accountHolder: string

    @IsNumber()
    @IsPositive()
    balance: number

    @IsString()
    @IsNotEmpty()
    accountId: string
}