import blockchains from "../mock/blockchains.json";

const usePrices = () => {
  const pricesHash: Record<string, number> = {};
  blockchains.forEach((bl) => {
    pricesHash[bl.currency] = bl.price;
  });
  return pricesHash;
};

export default usePrices;
