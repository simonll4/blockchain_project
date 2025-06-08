import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '../config/config.service';
import { ContractLoader } from './utils/contract-loader';
import { FactoryContract } from './interfaces/cfp-factory.interface';
import { CFPContract } from './interfaces/cfp.interface';

@Injectable()
export class ContractsService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Signer;
  //private factoryContract: Contract;
  private factoryContract: FactoryContract;

  constructor(
    private readonly configService: ConfigService,
    private readonly loader: ContractLoader,
  ) {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.getGanacheUrl(),
    );
    this.signer = this.createSigner();
    this.factoryContract = this.loader.loadFactoryContract(
      this.signer,
    ) as unknown as FactoryContract;
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
  getFactory(): FactoryContract {
    return this.factoryContract;
  }

  /** Devuelve una instancia firmadora de un contrato CFP por address */
  getCfp(address: string): CFPContract {
    return this.loader.loadCfpContract(address, this.signer);
  }
}
