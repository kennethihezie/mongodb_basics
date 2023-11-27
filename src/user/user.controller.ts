import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { UserDto } from './model/dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UpdateUserDto } from './model/dto/update_user.dto';

@Controller('user')
@Serialize()
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async createUser(@Body() userDto: UserDto){
        return await this.userService.createUser(userDto)

        // try {
        //     const user = await this.userService.createUser(userDto)

        //     return response.status(HttpStatus.CREATED).json({
        //         statusCode: 201,
        //         message: 'User created successfully',
        //         status: true,
        //         data: user
        //     })
        // } catch(err){

        //     return response.status(HttpStatus.BAD_REQUEST).json({
        //         statusCode: 400,
        //         message: 'Error: User not created!',
        //         status: false
        //     })
        // } 
    }

    @Patch('/:id')
    async updateUser(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(userId, updateUserDto)
    }

    @Get()
    async getAllUsers(){
        return this.userService.getAllUsers()
    }

    @Get('username')
    async getUserByName(@Query('name') name: string){        
        return this.userService.getUsersByName(name)
    }

    @Get('sort-by-alphabet')
    async sortUsersByAlphbeticalOrder(){
        return this.userService.sortUsersByAlphbeticalOrder()
    }

    @Get('limit-users-data')
    async limitUserData(@Query('limit') limit: string) {
        return this.userService.limitUserData(Number(limit))
    }

    @Get('/:id')
    async getUser(@Param('id') userId: string){
        return this.userService.getUser(userId)
    }

    @Delete('/:id')
    async deleteUser(@Param('id') userId: string) {
        return this.userService.deleteUser(userId)
    }

    @Delete()
    async deleteAllUsers() {
        return this.userService.deleteAllUsers()
    }

    @Get('user-projection')
    async projectionOfUserData(){
        return this.userService.projectionOfUserData()
    }

    @Get('ount-doc')
    async countDocument()  {
        return await this.userService.countUserDocuments()
    }
}
