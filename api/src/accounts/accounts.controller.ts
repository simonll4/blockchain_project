import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { MESSAGES } from 'src/common/messages';

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/creators')
  async getAllCreators() {
    try {
      const creators = await this.accountsService.getAllCreators();
      return { creators };
    } catch (error) {
      console.error('Error in getAllCreators:', error);
      throw new HttpException(
        { message: MESSAGES.INTERNAL_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/pendings')
  async getPendings() {
    try {
      const pending = await this.accountsService.getPendings();
      return { pending };
    } catch (error) {
      console.error('Error in getPendings:', error);
      throw new HttpException(
        { message: MESSAGES.INTERNAL_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
