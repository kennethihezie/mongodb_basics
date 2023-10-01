import { PartialType } from "@nestjs/mapped-types";
import { UserDto } from "./user.dto";

/*
UpdateStudentDto will extend the CreateStudentDto class using PartialType, 
it makes properties of CreateStudentDto optional, and it can be utilized in 
the UpdateStudentDto class as per the need.
*/
export class UpdateUserDto extends PartialType(UserDto) {}