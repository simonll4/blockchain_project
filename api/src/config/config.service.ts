import { Injectable } from '@nestjs/common';
import configData from './config.json';

@Injectable()
export class ConfigService {
  private readonly config: Record<string, any> = configData;

  get(key: string): any {
    return this.config[key];
  }

  getGanacheUrl(): string {
    return this.get('ganache_url');
  }

  getNetworkId(): string {
    return this.get('network_id');
  }

  getMnemonic(): string {
    return this.get('mnemonic');
  }

  getAccountIndex(): number {
    return this.get('account_index');
  }

  getHDPath(index: number): string {
    return this.get('hd_path_template').replace('{index}', index.toString());
  }

  getFactoryContractPath(): string {
    return this.get('factory_contract_path');
  }

  getCFPContractPath(): string {
    return this.get('cfp_contract_path');
  }
}
