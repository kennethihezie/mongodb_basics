import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Account } from './model/schema/account.schema';
import mongoose, { Model } from 'mongoose';
import { AccountDto } from './model/dto/account.dto';
import { TransferDto } from './model/dto/transfer.dto';
import { Transaction } from './model/schema/transaction.schema';

@Injectable()
export class AccountService {
    constructor(@InjectModel(Account.name) private accountModel: Model<Account>, @InjectModel(Transaction.name) private transactionModel: Model<Transaction>, @InjectConnection() private readonly connection: mongoose.Connection) {}

    async createAccount(accountDto: AccountDto): Promise<Account> {
        return await (new this.accountModel(accountDto).save())
    }

    async getAllAccounts(): Promise<Account[]>{
        return this.accountModel.find().exec()
    }

    async getByAccountId(accountId: string): Promise<Account>{
        const account = await this.accountModel.findOne({accountId: accountId})

            if(!account){
                throw new NotFoundException('Account not found')
            }
    
        return account
    }


    // MongoDb transactions
    async transaction(transferDto: TransferDto) {
         const { senderAccountId, amount, receiverAccountId } = transferDto
         // start a new session
         const session = await this.connection.startSession()
       
         try {
          // Begin a transaction with the WithTransaction() method on the session.
          const transactionResults = await session.withTransaction(async () => {
              // Operations will go here
              const senderUpdate = await this.accountModel.findOne({ accountId: senderAccountId }, {}, { balance: { $gte: ["$balance", amount] } })
              .updateOne(
                { accountId: senderAccountId },
                // Update the balance field of the sender’s account by decrementing the transaction_amount from the balance field
                { $inc: { balance: -amount } },
                { session }
              )

              const receiverUpdate = await this.accountModel.findOne({accountId: receiverAccountId}).updateOne(
                { accountId: receiverAccountId },
                // Update the balance field of the receiver’s account by incrementing the transaction_amount to the balance field.
                { $inc: { balance: amount } },
                { session }
              )

              const transfer: TransferDto = {
                senderAccountId: senderAccountId,
                receiverAccountId: receiverAccountId,
                amount: amount,
                transactionRef: 'TR21872187'
              }
            
              await (new this.transactionModel(transfer, { session }).save())
          })
         
          if (transactionResults) {
            console.log("Transaction completed successfully.")
          } else {
            console.log("Transaction failed.")
          }
        } catch(e){
            console.error(`Transaction aborted: ${e}`)
            process.exit(1)
        } finally {
            await session.endSession()
        }
    }

    // Aggeration has four stages
    /*
    Finding
    Sorting
    Grouping
    Projecting
    */
    async aggregation(): Promise<Account[]>{
       const pipeline = [
         /*
         $match filters documents to pass only the documents that
         match the specified conditions to the next stage of the pipeline

         $lt is less than
         */
         { $match: { balance: { $lt: 1000} } },

           { $group: {
            // _id: "$account_type",
            total_balance: { $sum: "$balance" },
            avg_balance: { $avg: "$balance" }
          }
         }
       ]

       const acccounts = await this.accountModel.aggregate(pipeline)

       if(!acccounts){
        throw new NotFoundException("No accounts found with this agregate")
       }

       return acccounts
    }

    async anotherAggregation(): Promise<Account[]> {
      const pipeline = [
        // Stage 1: $match - filter the documents (checking, balance >= 1500)
        { $match: { account_type: "checkings", balance: { $gte: 1500 } } },

        // Stage 2: $sort - sorts the documents in descending order (balance)
        { $sort: { balance: -1 } },

      // Stage 3: $project - project only the requested fields and one computed field (account_type, account_id, balance, gbp_balance)
        { 
          $project: {
          _id: 0,
          account_id: 1,
          account_type: 1,
          balance: 1,
          // GBP stands for Great British Pound
          gbp_balance: { $divide: ["$balance", 1.3] }
         }
       }
     ]

     const acccounts = await this.accountModel.aggregate(pipeline)

     if(!acccounts){
      throw new NotFoundException("No accounts found with this agregate")
     }

     return acccounts
    }
}