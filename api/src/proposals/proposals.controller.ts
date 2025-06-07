import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { MESSAGES } from '../common/messages';

@Controller('')
export class ProposalsController {
  constructor(private readonly proposalService: ProposalsService) {}

  @Post('register-proposal')
  async registerProposal(@Body() body: { callId: string; proposal: string }) {
    const { callId, proposal } = body;

    // Validaciones simples (puedes hacer una clase DTO si querés)
    if (!/^0x[a-fA-F0-9]{64}$/.test(callId)) {
      throw new HttpException(MESSAGES.INVALID_CALLID, HttpStatus.BAD_REQUEST);
    }

    if (!/^0x[a-fA-F0-9]{64}$/.test(proposal)) {
      throw new HttpException(
        MESSAGES.INVALID_PROPOSAL,
        HttpStatus.BAD_REQUEST,
      );
    }

    const txHash = await this.proposalService.registerProposal(
      callId,
      proposal,
    );

    return {
      message: MESSAGES.OK,
      txHash,
    };
  }
}

// import {
//   Controller,
//   Post,
//   Body,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { ProposalService } from './proposal.service';

// @Controller()
// export class ProposalController {
//   constructor(private readonly proposalService: ProposalService) {}

//   @Post('register-proposal')
//   async registerProposal(
//     @Body('callId') callId: string,
//     @Body('proposal') proposal: string,
//   ) {
//     // Aquí validaciones básicas tipo content-type y hash pueden ir en pipes o en DTO con class-validator
//     try {
//       const txHash = await this.proposalService.registerProposal(
//         callId,
//         proposal,
//       );
//       return { message: 'OK', txHash };
//     } catch (error) {
//       if (error.message === 'CALLID_NOT_FOUND') {
//         throw new HttpException('CALLID_NOT_FOUND', HttpStatus.NOT_FOUND);
//       }
//       if (error.message === 'ALREADY_REGISTERED') {
//         throw new HttpException('ALREADY_REGISTERED', HttpStatus.FORBIDDEN);
//       }
//       throw new HttpException(
//         'INTERNAL_ERROR',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }

// // import { Controller } from '@nestjs/common';

// // @Controller('proposal')
// // export class ProposalController {}
