import { WalletBalance } from "../components/wallet-page";
import blockchains from "../mock/blockchains.json";

const useWalletBalances = () => {
  return [
    ...blockchains.map((bl) => ({ ...bl, amount: Math.random() })),
  ] as WalletBalance[];
};

export default useWalletBalances;
