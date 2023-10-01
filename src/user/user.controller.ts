import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { UserDto } from './model/dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { Serialize } from './interceptors/serialize.interceptor';

@Controller('user')
@Serialize()
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async createUser(@Res() response: Response,  @Body() userDto: UserDto){
        try {
            const user = await this.userService.createUser(userDto)

            return response.status(HttpStatus.CREATED).json({
                statusCode: 201,
                message: 'User created successfully',
                status: true,
                data: user
            })
        } catch(err){

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: User not created!',
                status: false
            })
        } 
    }

    @Patch('/:id')
    async updateUser(@Param('id') userId: string, @Body() userDto: UserDto) {
        return this.userService.updateUser(userId, userDto)
    }

    @Get()
    async getAllUsers(){
        return this.userService.getAllUsers()
    }

    @Get('/:id')
    async getUser(@Param('id') userId: string){
        return this.userService.getUser(userId)
    }

    @Delete('/:id')
    async deleteUser(@Param('id') userId: string) {
        return this.userService.deleteUser(userId)
    }
}
