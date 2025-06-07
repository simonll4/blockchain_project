import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ContractsService } from '../contracts/contracts.service';

@Injectable()
export class AccountsService {
  constructor(private readonly contractsService: ContractsService) {}

  async getAllCreators(): Promise<string[]> {
    const factory = this.contractsService.getFactory();
    const count: bigint = await factory.creatorsCount();
    const creators: string[] = [];

    for (let i = 0; i < Number(count); i++) {
      const creator: string = await factory.creators(i);
      creators.push(creator);
    }

    return creators;
  }

  async getPendings(): Promise<string[]> {
    const factory = this.contractsService.getFactory();
    const signer = this.contractsService.getSigner();
    const from = await signer.getAddress();

    try {
      const count: bigint = await factory.pendingCount({ from });
      const pending: string[] = [];

      for (let i = 0; i < Number(count); i++) {
        const addr: string = await factory.getPending(i, { from });
        pending.push(addr);
      }

      return pending;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized access or RPC error');
    }
  }
}

// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AccountsService {}
