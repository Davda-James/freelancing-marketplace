import { ethers } from 'ethers';
import MarketplaceABI from '@/abis/Marketplace.json'; // path to your compiled ABI
import { MARKETPLACE_ADDRESS } from '@/constants'; // export your deployed address here

import { useState, useEffect } from 'react';

export const useMarketplaceContract = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const setupContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(MARKETPLACE_ADDRESS, MarketplaceABI.abi, signer);
      setContract(contractInstance);
    };
    setupContract();
  }, []);

  return contract;

};

