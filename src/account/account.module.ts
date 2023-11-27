import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './model/schema/account.schema';
import { Transaction, TransactionSchema } from './model/schema/transaction.schema';

@Module({
  controllers: [ AccountController ],
  providers: [ AccountService ],
  imports: [MongooseModule.forFeature([{name: Account.name, schema: AccountSchema}, {name: Transaction.name, schema: TransactionSchema}])]
})
export class AccountModule {}
