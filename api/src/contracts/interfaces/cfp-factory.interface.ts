import { ContractTransactionResponse } from 'ethers';

export interface CallForProposals {
  creator: string; // Dirección del creador del llamado
  cfp: string; // Dirección del contrato CFP asociado
}

export interface FactoryContract {
  /** Devuelve la dirección del dueño del contrato factory */
  owner(): Promise<string>;

  /** Devuelve el número de cuentas que han creado llamados */
  creatorsCount(): Promise<number>;

  /** Devuelve el address del creador en la posición `index` */
  creators(index: number): Promise<string>;

  /** Devuelve todos los callIds (identificadores de llamados) */
  allCallIds(): Promise<string[]>;

  /** Devuelve los detalles de un llamado a partir de su callId (bytes32) */
  calls(callId: string): Promise<CallForProposals>;

  /** Devuelve el callId en una posición específica para un creador dado */
  createdBy(creator: string, index: number): Promise<string>;

  /** Devuelve la cantidad de llamados creados por una cuenta */
  createdByCount(creator: string): Promise<number>;

  /** Devuelve el número de cuentas pendientes de autorización */
  pendingCount(): Promise<number>;

  /** Devuelve la dirección pendiente en la posición `index` */
  getPending(index: number): Promise<string>;

  /** Devuelve todas las direcciones pendientes de autorización */
  getAllPending(): Promise<string[]>;

  /** Indica si una cuenta está registrada (Pending o Authorized) */
  isRegistered(account: string): Promise<boolean>;

  /** Indica si una cuenta está autorizada para crear llamados */
  isAuthorized(account: string): Promise<boolean>;

  /**
   * Crea un llamado con un identificador único y fecha de cierre
   * @param callId - Identificador del llamado (bytes32 representado como string)
   * @param timestamp - Timestamp UNIX del cierre
   * @returns Dirección del contrato CFP creado
   */
  create(callId: string, timestamp: number): Promise<string>;

  /**
   * Crea un llamado en nombre de un creador específico
   * Solo el owner puede llamarlo
   * @param callId - Identificador único (bytes32)
   * @param timestamp - Timestamp de cierre
   * @param creator - Dirección del creador autorizado
   * @returns Dirección del contrato CFP creado
   */
  createFor(
    callId: string,
    timestamp: number,
    creator: string,
  ): Promise<string>;

  /** Solicita el registro para poder crear llamados (queda en estado Pending) */
  register(): Promise<ContractTransactionResponse>;

  /**
   * Autoriza a una cuenta registrada o la registra y autoriza directamente si no está registrada
   * Solo el owner puede llamarlo
   */
  authorize(account: string): Promise<ContractTransactionResponse>;

  /**
   * Revoca la autorización de una cuenta, la elimina si está pendiente
   * Solo el owner puede llamarlo
   */
  unauthorize(account: string): Promise<ContractTransactionResponse>;

  /**
   * Registra una propuesta para un llamado existente
   * @param callId - Identificador del llamado (bytes32)
   * @param proposal - Identificador de la propuesta (bytes32)
   */
  registerProposal(
    callId: string,
    proposal: string,
  ): Promise<ContractTransactionResponse>;
}
