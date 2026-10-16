import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [EmailsService],
  exports: [EmailsService],
  controllers: [EmailsController],
})
export class EmailsModule {}
