import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ConfigModule } from '../config/config.module';
import { ContractLoader } from './utils/contract-loader';

@Module({
  imports: [ConfigModule],
  providers: [ContractsService, ContractLoader],
  exports: [ContractsService],
})
export class ContractsModule {}
