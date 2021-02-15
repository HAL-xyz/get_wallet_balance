// Ethers
import { ethers } from 'ethers';

const checkAddress = (value) => {
  if (value) {
    try {
      ethers.utils.getAddress(value);
    } catch (e) {
      return false;
    }
    return true;
  }
  return false;
};

export default checkAddress;
