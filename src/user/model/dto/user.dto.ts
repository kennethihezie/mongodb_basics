import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class UserDto {
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsNotEmpty()
    roleNumber: number

    @IsNumber()
    @IsNotEmpty()
    class: number

    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    gender: string

    @IsNumber()
    @IsNotEmpty()
    marks: number
}