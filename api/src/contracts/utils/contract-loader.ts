import { Injectable } from '@nestjs/common';
import { Contract, Signer, InterfaceAbi } from 'ethers';
import * as fs from 'fs';
import { ConfigService } from '../../config/config.service';
import { CFPContract } from '../interfaces/cfp.interface';
import { FactoryContract } from '../interfaces/cfp-factory.interface';

interface ContractJson {
  abi: InterfaceAbi;
  networks?: {
    [networkId: string]: {
      address: string;
    };
  };
}

@Injectable()
export class ContractLoader {
  constructor(private readonly configService: ConfigService) {}

  private loadContractJson(path: string): ContractJson {
    const jsonStr = fs.readFileSync(path, 'utf-8');
    return JSON.parse(jsonStr) as ContractJson;
  }

  loadFactoryContract(signer: Signer): FactoryContract {
    const json = this.loadContractJson(
      this.configService.getFactoryContractPath(),
    );
    const { abi, networks } = json;

    const networkId = this.configService.getNetworkId();
    const address = networks?.[networkId]?.address;
    if (!address) {
      throw new Error(`Factory contract not deployed on network ${networkId}`);
    }

    return new Contract(address, abi, signer) as unknown as FactoryContract;
  }

  loadCfpContract(address: string, signer: Signer): CFPContract {
    const json = this.loadContractJson(this.configService.getCFPContractPath());
    return new Contract(address, json.abi, signer) as unknown as CFPContract;
  }

  getCfpAbi(): InterfaceAbi {
    return this.loadContractJson(this.configService.getCFPContractPath()).abi;
  }
}
