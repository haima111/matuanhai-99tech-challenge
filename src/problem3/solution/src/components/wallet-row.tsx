type WalletRowProps = {
  className?: string;
  blockchain?: string;
  currency?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
};

const WalletRow = (props: WalletRowProps) => {
  const { blockchain, currency, amount, usdValue, formattedAmount, className } =
    props;
  return (
    <div className={className}>
      {`Blockchain: ${blockchain} --- Currency: ${currency} --- Amount: ${amount} --- USD: ${usdValue} --- Formatted Amount: ${formattedAmount}`}
    </div>
  );
};

export default WalletRow;
