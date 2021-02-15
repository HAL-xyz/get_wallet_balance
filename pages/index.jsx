import React, { useEffect, useState } from 'react';

// Lib
import getERC20Tokens from '@/lib/getERC20Tokens';

// Helpers
import checkAddress from '@/helpers/checkAddress';
import divideByDecimals from '@/helpers/units';

// React Hook Form
import { useForm } from 'react-hook-form';

// Ethers
import { ethers } from 'ethers';

// Abi
import abi from '@/abis/abi';

import Head from 'next/head';

const ADDRESS = '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39';
const provider = ethers.getDefaultProvider();
const ethereumBalanceChecker = new ethers.Contract(ADDRESS, abi, provider);

const home = () => {
  const { register, handleSubmit, watch } = useForm();
  const [ERC20Tokens, setERC20Tokens] = useState();
  const [ERC20Array, setERC20Array] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBalances, setIsLoadingBalances] = useState(null);
  const [isValidAddress, setIsValidAddress] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [userBalances, setUserBalances] = useState([]);

  const wallet = watch('wallet');

  useEffect(() => {
    (async () => {
      const tokensList = await getERC20Tokens(setIsLoading);
      const tokensArray = tokensList.map((token) => token.address);
      setERC20Tokens(tokensList);
      setERC20Array(tokensArray);
    })();
  }, []);

  useEffect(() => {
    setDisabled(true);
    if (wallet) {
      if (checkAddress(wallet) && wallet.length > 0) {
        setDisabled(false);
        return setIsValidAddress(true);
      }
      setDisabled(true);
      return setIsValidAddress(false);
    }
  }, [wallet]);

  const onSubmit = async (data) => {
    setDisabled(true);
    setIsLoadingBalances(true);
    const balances = await ethereumBalanceChecker.balances([data.wallet], ERC20Array);
    const results = [];
    ERC20Tokens.forEach((item, index) => {
      const token = {};
      token.symbol = item.symbol;
      token.balance = divideByDecimals(balances[index], item.decimal).toString();
      if (token.balance > 0) {
        results.push(token);
      }
    });
    setDisabled(false);
    setIsLoadingBalances(false);
    setUserBalances(results);
  };

  return (
    <div className="container mx-auto">
      {isLoading
        && (
          <p>Is loading...</p>
        )}
      {!isLoading
        && (
          <div className="mt-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input type="text" placeholder="0x" name="wallet" ref={register({ required: true })} />
              <div className="mt-4">
                <button
                  className={`
                      ${
                        disabled
                          ? 'bg-gray-300'
                          : 'bg-purple-600'
                      }
                      ${
                        disabled
                          ? 'cursor-not-allowed'
                          : 'cursor-pointer'
                      }
                      text-white
                      p-4
                    `}
                  type="button"
                  aria-label="Submit"
                  disabled={disabled}
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit
                </button>
              </div>
            </form>
            {isValidAddress === false
              && (
                <p className="mt-1 text-xs">Error!</p>
              )}
          </div>
        )}
      {isLoadingBalances
        && (
          <p className="mt-4">⏳ Fetching data on-chain...</p>
        )}
      {!isLoadingBalances
        && (
          <div className="mt-4">
            {userBalances.map((balance) => (
              <p key={balance.symbol}>
                <span className="font-bold">{balance.symbol}:</span>
                <span>&nbsp;</span>
                <span>{balance.balance}</span>
              </p>
            ))}
          </div>
        )}
      <footer className="mt-16">
        <a
          href="https://www.hal.xyz"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with ❤️  by HAL.xyz
        </a>
      </footer>
    </div>
  );
};

export default home;
