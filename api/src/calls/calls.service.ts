import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ethers } from 'ethers';

import { ContractsService } from '../contracts/contracts.service';
import { MESSAGES } from '../common/messages';

export interface Call {
  callId: string;
  creator: string;
  cfpAddress: string;
  closingTime: string | null;
}

@Injectable()
export class CallsService {
  constructor(private readonly contractsService: ContractsService) {}

  async getCall(callId: string) {
    const ZeroAddress = ethers.ZeroAddress;
    const factory = this.contractsService.getFactory();

    // Validación de formato TODO middleware que valide el formato
    if (!ethers.isHexString(callId, 32)) {
      throw new Error('INVALID_CALLID');
    }

    const call = await factory.calls(callId);
    console.log('call', call);

    if (call[0] === ZeroAddress) {
      throw new Error('CALLID_NOT_FOUND');
    }

    //TODO  agregar closing-time en el return

    return {
      creator: call[0],
      cfpAddress: call[1],
    };
  }

  async getAllCalls(): Promise<Call[]> {
    try {
      const factory = this.contractsService.getFactory();
      const callIds: string[] = await factory.allCallIds();
      
      const calls: Call[] = [];
      for (const callId of callIds) {
        const call = await factory.calls(callId);
        const cfpAddress = call[1];
        let closingTimeIso: string | null = null;

        try {
          const cfpContract = this.contractsService.getCfp(cfpAddress);
          const closingTime: bigint = await cfpContract.closingTime();
          closingTimeIso = new Date(Number(closingTime) * 1000).toISOString();
        } catch (error) {
          // Omitimos el closingTime si no se puede leer
          closingTimeIso = null;
        }

        calls.push({
          callId,
          creator: call[0],
          cfpAddress,
          closingTime: closingTimeIso,
        });
      }

      return calls;
    } catch (error) {
      throw new InternalServerErrorException(MESSAGES.INTERNAL_ERROR);
    }
  }

  async getClosingTime(callId: string) {
    const ZeroAddress = ethers.ZeroAddress;
    const factory = this.contractsService.getFactory();

    if (!ethers.isHexString(callId, 32)) {
      throw new Error('INVALID_CALLID');
    }

    const call = await factory.calls(callId);
    if (call[0] === ZeroAddress) {
      throw new Error('CALLID_NOT_FOUND');
    }

    const cfpAddress = call[1];
    try {
      const cfpContract = this.contractsService.getCfp(cfpAddress);
      const closingTime: bigint = await cfpContract.closingTime();
      const closingTimeIso = new Date(Number(closingTime) * 1000).toISOString();

      return { closingTime: closingTimeIso };
    } catch (error) {
      throw new Error('INTERNAL_ERROR');
    }
  }
}
