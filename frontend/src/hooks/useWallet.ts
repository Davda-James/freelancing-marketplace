import { useState, useEffect } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
  chainId: number | null;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    balance: null,
    chainId: null,
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    setWallet(prev => ({ ...prev, isConnecting: true }));

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });

      // Convert balance from wei to ETH
      const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);

      setWallet({
        address: accounts[0],
        isConnected: true,
        isConnecting: false,
        balance: balanceInEth,
        chainId: parseInt(chainId, 16),
      });

      // Store in localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', accounts[0]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      balance: null,
      chainId: null,
    });
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };

  const switchNetwork = async (chainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to wallet
        console.error('Network not added to wallet');
      }
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && localStorage.getItem('walletConnected')) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({
              method: 'eth_chainId',
            });

            const balance = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest'],
            });

            const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);

            setWallet({
              address: accounts[0],
              isConnected: true,
              isConnecting: false,
              balance: balanceInEth,
              chainId: parseInt(chainId, 16),
            });
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWallet(prev => ({ ...prev, address: accounts[0] }));
          window.location.reload();
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setWallet(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
};