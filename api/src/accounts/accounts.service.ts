import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContractsService } from '../contracts/contracts.service';
import { FactoryContract } from '../contracts/interfaces/cfp-factory.interface';

@Injectable()
export class AccountsService {
  constructor(private readonly contractsService: ContractsService) {}

  async getAllCreators(): Promise<string[]> {
    const factory: FactoryContract = this.contractsService.getFactory();
    const count: number = await factory.creatorsCount();
    const creators: string[] = [];

    for (let i = 0; i < count; i++) {
      const creator: string = await factory.creators(i);
      creators.push(creator);
    }

    return creators;
  }

  async getPendings(): Promise<string[]> {
    const factory: FactoryContract = this.contractsService.getFactory();

    try {
      const count: number = await factory.pendingCount();
      const pending: string[] = [];

      for (let i = 0; i < count; i++) {
        const addr: string = await factory.getPending(i);
        pending.push(addr);
      }

      return pending;
    } catch (error) {
      console.error('Error in getPendings:', error);
      throw new UnauthorizedException('Unauthorized access or RPC error');
    }
  }
}
