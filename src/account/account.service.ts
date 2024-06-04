import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Account } from './model/schema/account.schema';
import mongoose, { Model } from 'mongoose';
import { AccountDto } from './model/dto/account.dto';
import { TransferDto } from './model/dto/transfer.dto';
import { Transaction } from './model/schema/transaction.schema';
import { Helpers } from 'src/utils/helpers';

@Injectable()
export class AccountService {
    constructor(@InjectModel(Account.name) private accountModel: Model<Account>, @InjectModel(Transaction.name) private transactionModel: Model<Transaction>, @InjectConnection() private readonly connection: mongoose.Connection) {}

    async createAccount(accountDto: AccountDto): Promise<Account> {
        return await (new this.accountModel(accountDto).save())
    }

    async getAllAccounts(): Promise<Account[]>{
        return this.accountModel.find().exec()
    }

    async deleteAllAccounts() {
      return await this.accountModel.deleteMany()
    }

    async deleteAllTransactions() {
      return await this.transactionModel.deleteMany()
    }

    async getByAccountId(accountId: string): Promise<Account>{
        const account = await this.accountModel.findOne({ accountId: accountId })

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
          // Begin a transaction with the withTransaction() method on the session.
          const transactionResults = await session.withTransaction(async () => {
              // Operations will go here
              const senderUpdate = await this.accountModel.findOne({ accountId: senderAccountId }, {}, { balance: { $gte: [ "$balance", amount ] } })
              .updateOne(
                { accountId: senderAccountId },
                // Update the balance field of the sender’s account by decrementing the transaction_amount from the balance field
                { $inc: { balance: -amount } },
                { session }
              )

              const receiverUpdate = await this.accountModel.findOne({ accountId: receiverAccountId }).updateOne(
                { accountId: receiverAccountId },
                // Update the balance field of the receiver’s account by incrementing the transaction_amount to the balance field.
                { $inc: { balance: amount } },
                { session }
              )

              const transfer: TransferDto = {
                senderAccountId: senderAccountId,
                receiverAccountId: receiverAccountId,
                amount: amount,
                transactionRef: Helpers.generateRandomString()
              }
            
              await (new this.transactionModel(transfer, { session }).save())
          })
         
          if (transactionResults) {
            console.log("Transaction completed successfully.", transactionResults)
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

    /*
    Aggeration has four stages

    1: Finding
    2: Sorting
    3: Grouping
    4: Projecting
    */
    async basicAggregation(): Promise<Account[]> {      
       const pipeline = [
         /*
         $match filters documents to pass only the documents that
         match the specified conditions to the next stage of the pipeline

         $lt is less than
         */
         { $match: { balance: { $lt: 1000} } },

           { $group: {
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

    async advanceAggregation(): Promise<Account[]> {
      const pipeline = [
        // Stage 1: $match - filter the documents (checking, balance >= 1500)
        { $match: { /*account_type: "checkings",*/ balance: { $gte: 500 } }},
        
        // Stage 2: $sort -1 sorts the documents in descending order (balance)
        { $sort: { balance: -1 } },
  
        // Stage 3: $group the data
        {
          $group: {
           total_balance: { $sum: "$balance" },
           avg_balance: { $avg: "$balance" }
          }
       },
      
       // Stage 4: $project - project only the requested fields and one computed field (account_type, account_id, balance, gbp_balance)
       { 
        $project: {
        _id: 0,
        account_id: 1,
        accountHolder: 1,
        balance: 1,
        // GBP stands for Great British Pound
        gbp_balance: { $divide: ["$balance", 1.3] }
       }
     }
       ]

     // @ts-ignore
     const acccounts = await this.accountModel.aggregate(pipeline)

     if(!acccounts){
      throw new NotFoundException("No accounts found with this agregate")
     }

     return acccounts
    }
}