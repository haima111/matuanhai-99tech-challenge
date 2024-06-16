import { useMemo } from "react";
import usePrices from "../hooks/use-prices";
import useWalletBalances from "../hooks/use-wallet-balances";
import WalletRow from "./wallet-row";

export interface WalletBalance {
  blockchain: string;
  price: number;
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// 1. delete BoxProps: children is not used
// 2. create useWalletBalances hook
// 2. create usePrices hook
// 3. change balancePriority -> lhsPriority
// 4. optimize use memo remove dependencies prices, default sort return 0;, change balance.amount <= 0 to balance.amount >= 0
// 5. change const rows = sortedBalances.map => to const rows = formattedBalances.map to get formatted value
// 6. create wallet row component
const WalletPage = () => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const lhsPriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          if (balance.amount >= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs, rhs) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0;
      });
  }, [balances]);
  console.log("sortedBalances", sortedBalances);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      const originalBalance = balances.find(
        (bl) => bl.currency === balance.currency
      );
      return (
        <WalletRow
          className={"row"}
          blockchain={originalBalance?.blockchain}
          currency={originalBalance?.currency}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div>{rows}</div>;
};

export default WalletPage;
