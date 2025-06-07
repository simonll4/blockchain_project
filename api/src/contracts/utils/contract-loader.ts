import { Injectable } from '@nestjs/common';
import { ethers, Contract, Signer } from 'ethers';
import * as fs from 'fs';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class ContractLoader {
  constructor(private readonly configService: ConfigService) {}

  private loadContractJson(path: string): any {
    const jsonStr = fs.readFileSync(path, 'utf-8');
    return JSON.parse(jsonStr);
  }

  loadFactoryContract(signerOrProvider: ethers.Signer): Contract {
    const json = this.loadContractJson(
      this.configService.getFactoryContractPath(),
    );
    const abi = json.abi;
    const networkId = this.configService.getNetworkId();

    const address = json.networks[networkId]?.address;
    if (!address) {
      throw new Error(`Factory contract not deployed on network ${networkId}`);
    }

    return new ethers.Contract(address, abi, signerOrProvider);
  }

  loadCfpContract(address: string, signerOrProvider: ethers.Signer): Contract {
    const json = this.loadContractJson(this.configService.getCFPContractPath());
    const abi = json.abi;

    return new ethers.Contract(address, abi, signerOrProvider);
  }

  getCfpAbi(): any {
    const json = this.loadContractJson(this.configService.getCFPContractPath());
    return json.abi;
  }
}
