import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CallsService } from './calls.service';
import { MESSAGES } from '../common/messages';

@Controller()
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get('/calls/:callId')
  async getCall(@Param('callId') callId: string) {
    try {
      const call = await this.callsService.getCall(callId);

      return {
        creator: call.creator,
        cfp: call.cfpAddress,
      };
    } catch (error) {
      switch (error.message) {
        case 'INVALID_CALLID':
          throw new HttpException(
            { message: MESSAGES.INVALID_CALLID },
            HttpStatus.BAD_REQUEST,
          );
        case 'CALLID_NOT_FOUND':
          throw new HttpException(
            { message: MESSAGES.CALLID_NOT_FOUND },
            HttpStatus.NOT_FOUND,
          );
        default:
          throw new HttpException(
            { message: MESSAGES.INTERNAL_ERROR },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  @Get('/calls')
  async getAllCalls() {
    try {
      return await this.callsService.getAllCalls();
    } catch (error) {
      throw new HttpException(
        { message: MESSAGES.INTERNAL_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/closing-time/:callId')
  async getClosingTime(@Param('callId') callId: string) {
    try {
      return await this.callsService.getClosingTime(callId);
    } catch (error) {
      switch (error.message) {
        case 'INVALID_CALLID':
          throw new HttpException(
            { message: MESSAGES.INVALID_CALLID },
            HttpStatus.BAD_REQUEST,
          );
        case 'CALLID_NOT_FOUND':
          throw new HttpException(
            { message: MESSAGES.CALLID_NOT_FOUND },
            HttpStatus.NOT_FOUND,
          );
        default:
          throw new HttpException(
            { message: MESSAGES.INTERNAL_ERROR },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }
}
