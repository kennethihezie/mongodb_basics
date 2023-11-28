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
        return await (new this.userModel(userDto).save())
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

    async deleteAllUsers() {
        return await this.userModel.deleteMany()
    }

    async getUsersByName(name: string): Promise<User[]> {
        // using in operator
        // await this.userModel.find({'name': { $in:['kenneth', 'collins'] } })
        // query for sub fields
        // await this.userModel.find({`adress.lat`: lat})
        const users  = await this.userModel.find({ 'name': name })

        if(!users){
           throw new NotFoundException('No user with the name')
        }

        return users
    }

    async sortUsersByAlphbeticalOrder(): Promise<User[]> {
        // sorting users using the name property by alphabetical order
        // when sorting passing 1 means ascending and -1 means decending.
        const users = await this.userModel.find().sort({ name: 1 })
        if(!users){
            throw new NotFoundException('No users in data.')
        }

        return users
    }

    async limitUserData(limit: number): Promise<User[]> {
        const users = this.userModel.find().limit(limit)
        if(!users){
            throw new NotFoundException('No users in data.')
        }

        return users
    }

    async projectionOfUserData(): Promise<User[]>{
        // projections in mongodb is when you return subset of data from a document
        //_id to 0 means exclude the _id field.
        const user = await this.userModel.find({}, { name: 1, roleNumber: 1, _id: 0 }).exec()

        if(!user){
            throw new NotFoundException('No users in data.')
        }

        return user
    }

    async countUserDocuments(){
        //you can also pass in query in the countDocument function
        const count = await this.userModel.countDocuments()

        console.log(count);
    }

    async mongoDbIndexes(){
        /*
        Indexes are special data structures that store small portion of the data, in an ordered form that is easy to search efficiently.
        indexes point to document identity and allow to lookup and update data faster.
 
        Types of indexes: 
        Single field indexes: are indexes in one field only.
        Compound field indexes: include more than one field in the index.

        Refer to this link: https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/#:~:text=Indexes%20are%20data%20structures%20that,documents%20that%20match%20each%20query
        */       
     }
}
