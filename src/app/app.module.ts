import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Helpers } from 'src/utils/helpers';

@Module({
  imports: [MongooseModule.forRoot(Helpers.databaseUrl, { dbName: 'users_db' }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
