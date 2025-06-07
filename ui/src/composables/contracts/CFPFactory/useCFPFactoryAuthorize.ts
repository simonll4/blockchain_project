import { useCFPFactory } from "@/services/contracts/useCFPFactory";
import { useTxHandler } from "../useTxHandler";

export function useCFPFactoryAuthorize() {
  const { authorize } = useCFPFactory();
  const { isLoading, error, success, message, runTx } = useTxHandler();

  const authorizeAccount = async (address: string) => {
    if (!address) throw new Error("Dirección inválida");
    await runTx(
      () => authorize(address),
      `Cuenta ${address} autorizada correctamente`
    );
  };

  return {
    isLoading,
    error,
    success,
    message,
    authorizeAccount,
  };
}
