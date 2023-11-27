import { PartialType } from "@nestjs/mapped-types";
import { UserDto } from "./user.dto";

/*
UpdateUserDto will extend the UserDto class using PartialType, 
it makes properties of UserDto optional, and it can be utilized in 
the UpdateUserDto class as per the need.
*/
export class UpdateUserDto extends PartialType(UserDto) {}