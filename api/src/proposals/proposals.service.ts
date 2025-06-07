import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ContractsService } from '../contracts/contracts.service';
import { ethers } from 'ethers';
import { MESSAGES } from '../common/messages';

@Injectable()
export class ProposalsService {
  constructor(private readonly contractsService: ContractsService) {}

  async registerProposal(callId: string, proposal: string): Promise<string> {
    const ZeroAddress = ethers.ZeroAddress;

    const factory = this.contractsService.getFactory();

    // Obtener llamada con callId
    const createdCall = await factory.calls(callId);
    if (createdCall[0] === ZeroAddress) {
      throw new HttpException(MESSAGES.CALLID_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const cfpAddress = createdCall[1];
    const cfpContract = this.contractsService.getCfp(cfpAddress);

    const data = await cfpContract.proposalData(proposal);
    if (data[0] !== ZeroAddress) {
      throw new HttpException(
        MESSAGES.ALREADY_REGISTERED,
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const callIdBytes = ethers.hexlify(callId);
      const proposalBytes = ethers.hexlify(proposal);

      const tx = await factory.registerProposal(callIdBytes, proposalBytes);
      await tx.wait();

      return tx.hash;
    } catch (err) {
      console.error('[ERROR] registerProposal', err);
      throw new HttpException(
        MESSAGES.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

// import { Injectable } from '@nestjs/common';
// import { ContractsService } from '../contracts/contracts.service';
// import { ethers } from 'ethers';

// @Injectable()
// export class ProposalService {
//   constructor(private readonly contractsService: ContractsService) {}

//   async registerProposal(callId: string, proposal: string): Promise<string> {
//     const ZeroAddress = ethers.ZeroAddress;

//     const factory = this.contractsService.getFactory();

//     // Obtener llamada con callId (funciones view son async)
//     const createdCall = await factory.calls(callId);
//     if (createdCall[0] === ZeroAddress) {
//       throw new Error('CALLID_NOT_FOUND');
//     }

//     const cfpAddress = createdCall[1];
//     const cfpContract = this.contractsService.getCfp(cfpAddress);

//     const data = await cfpContract.proposalData(proposal);
//     if (data[0] !== ZeroAddress) {
//       throw new Error('ALREADY_REGISTERED');
//     }

//     // Convert callId and proposal to bytes32
//     const callIdBytes = ethers.hexlify(callId);
//     const proposalBytes = ethers.hexlify(proposal);

//     // Enviar la transacción firmada (el signer está integrado)
//     const tx = await factory.registerProposal(callIdBytes, proposalBytes);
//     await tx.wait();

//     return tx.hash;
//   }
// }
