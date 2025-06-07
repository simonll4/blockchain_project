import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { MESSAGES } from 'src/common/messages';

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('creators')
  async getAllCreators() {
    try {
      const creators = await this.accountsService.getAllCreators();
      return { creators };
    } catch (error) {
      throw new HttpException(
        { message: MESSAGES.INTERNAL_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('pendings')
  async getPendings() {
    try {
      const pending = await this.accountsService.getPendings();
      return { pending };
    } catch (error) {
      throw new HttpException(
        { message: MESSAGES.INTERNAL_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

// import { Controller } from '@nestjs/common';

// @Controller('accounts')
// export class AccountsController {}
