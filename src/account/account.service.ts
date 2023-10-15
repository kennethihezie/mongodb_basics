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

    async getByAccountId(accountId: string, amount?: number): Promise<Account>{
        // if(amount){
        //     const account = await this.accountModel.findOne({accountId: accountId}, {}, { balance: { $gte: ["$balance", amount] } })
           
        //     if(!account){
        //        throw new NotFoundException('Insufficient funds on account')
        //     }

        //     return account
        // }

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
}
