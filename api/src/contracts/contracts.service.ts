import { Injectable } from '@nestjs/common';
import { ethers, Contract, Wallet } from 'ethers';
import { ConfigService } from '../config/config.service';
import { ContractLoader } from './utils/contract-loader';

@Injectable()
export class ContractsService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Signer;
  private factoryContract: Contract;

  constructor(
    private readonly configService: ConfigService,
    private readonly loader: ContractLoader,
  ) {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.getGanacheUrl(),
    );
    this.signer = this.createSigner(); // derivado del mnemonic
    this.factoryContract = this.loader.loadFactoryContract(this.signer); // contrato con firma
  }

  private createSigner(): ethers.Signer {
    const mnemonic = this.configService.getMnemonic();
    const index = this.configService.getAccountIndex();
    const hdPath = this.configService.getHDPath(index);

    const wallet = ethers.HDNodeWallet.fromMnemonic(
      ethers.Mnemonic.fromPhrase(mnemonic),
      hdPath,
    );
    return wallet.connect(this.provider);
  }

  /** Devuelve el signer actual */
  getSigner(): ethers.Signer {
    return this.signer;
  }

  /** Devuelve la instancia firmadora del contrato CFPFactory */
  getFactory(): Contract {
    return this.factoryContract;
  }

  /** Devuelve una instancia firmadora de un contrato CFP por address */
  getCfp(address: string): Contract {
    return this.loader.loadCfpContract(address, this.signer);
  }
}
