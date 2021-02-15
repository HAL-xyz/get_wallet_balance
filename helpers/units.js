/* eslint no-param-reassign: "off" */

import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: 78 });

const divideByDecimals = (value, decimals) => {
  value = (new BigNumber(value.toString())).div(`1e${decimals}`);
  return value;
};

export default divideByDecimals;
