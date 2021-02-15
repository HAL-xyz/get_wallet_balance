import fetch from 'node-fetch';

const TOKENS = 'https://raw.githubusercontent.com/MyEtherWallet/etherwallet/mercury/app/scripts/tokens/ethTokens.json';

const getERC20Tokens = async (setIsLoading) => {
  setIsLoading(true);
  const response = await fetch(TOKENS);
  const data = await response.json();
  setIsLoading(false);
  return data.map(({
    address,
    symbol,
    decimal,
  }) => ({
    address,
    symbol,
    decimal,
  }));
};

export default getERC20Tokens;
