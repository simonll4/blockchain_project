// cfp.interface.ts

import { BigNumberish, ContractTransaction } from 'ethers';

export interface ProposalData {
  sender: string;
  blockNumber: BigNumberish;
  timestamp: BigNumberish;
}

export interface CFPContract {
  // Getters
  callId(): Promise<string>;
  closingTime(): Promise<BigNumberish>;
  creator(): Promise<string>;
  proposalCount(): Promise<BigNumberish>;
  proposalData(proposal: string): Promise<ProposalData>;
  proposalTimestamp(proposal: string): Promise<BigNumberish>;
  proposals(index: BigNumberish): Promise<string>;

  // Registration functions
  registerProposal(proposal: string): Promise<ContractTransaction>;
  registerProposalFor(
    proposal: string,
    sender: string,
  ): Promise<ContractTransaction>;

  // Events (event signatures useful for filters)
  filters: {
    ProposalRegistered(
      proposal?: string | null,
      sender?: string | null,
      blockNumber?: null,
    ): any;
  };
}
