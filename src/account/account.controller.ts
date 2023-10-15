import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './model/dto/account.dto';
import { TransferDto } from './model/dto/transfer.dto';

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

    @Get('/:id')
    async getAccountById(@Param('id') accountId: string,  @Query('amount') amount: number){          
        return this.accountService.getByAccountId(accountId, amount)
    }

    @Post('/transfer')
    async transferMoney(@Body() transferDto: TransferDto) {  
        return this.accountService.transaction(transferDto)
    }
}
