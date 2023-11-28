import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './model/dto/account.dto';
import { TransferDto } from './model/dto/transfer.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Serialize()
@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService){}

    @Post()
    async createAccount(@Body() accountDto: AccountDto){
       return this.accountService.createAccount(accountDto)
    }

    @Get()
    async getAllAccounts(){
        return this.accountService.getAllAccounts()
    }

    @Delete()
    async deleteAllAccount() {
        return this.accountService.deleteAllAccounts()
    }

    @Delete('transactions')
    async deleteAllTransactions() {
        return await this.accountService.deleteAllTransactions()
    }

    @Get('/:id')
    async getAccountById(@Param('id') accountId: string){          
        return this.accountService.getByAccountId(accountId)
    }

    @Post('/transfer')
    async transferMoney(@Body() transferDto: TransferDto) {  
        return this.accountService.transaction(transferDto)
    }

    @Get('/basic-aggregation')
    async basicAggregation(){       
       return this.accountService.basicAggregation()
    }

    @Get('/advance-aggregation')
    async advanceAggregation(){
        return this.accountService.advanceAggregation()
    }
}
