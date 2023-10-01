import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './model/schema/user.schema';
import { Model } from 'mongoose';
import { UserDto } from './model/dto/user.dto';
import { UpdateUserDto } from './model/dto/update_user.dto';


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(userDto: UserDto): Promise<User> {
        const user = await (new this.userModel(userDto).save())
        return user
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
            new: true
        })

        if(!user) {
            throw new NotFoundException(`User with id: ${userId} not found`)
        }

        return user
    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.userModel.find().exec()
        if(!users || users.length == 0){
            throw new NotFoundException('Users data not found!')
        }

        return users
    }

    async getUser(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId)

        if(!user){
            throw new NotFoundException('User not found!')
        }

        return user
    }

    async deleteUser(userId: string): Promise<User> {
        const user = this.userModel.findByIdAndDelete(userId)

        if(!user){
            throw new NotFoundException(`User with id: ${userId} not found`)
        }

        return user
    }
}
