// src/proposal/proposal.module.ts
import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { ContractsModule } from '../contracts/contracts.module'; // Importa ContractsModule

@Module({
  imports: [ContractsModule], // ContractsModule ya incluye ConfigService y ContractsService
  providers: [ProposalsService], // No declares ContractsService aquí (viene de ContractsModule)
  controllers: [ProposalsController],
})
export class ProposalsModule {}
