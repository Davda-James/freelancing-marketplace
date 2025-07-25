import React, { useState } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { BrowserProvider } from  'ethers';

const provider = new BrowserProvider(window.ethereum);
const network = await provider.getNetwork();

export const WalletButton: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      // You could add a toast notification here
    }
  };

  const getNetworkName = () => {
    return network.name || 'Unknown';    
    // switch (chainId) {
    //   case 1: return 'Ethereum';
    //   case 5: return 'Goerli';
    //   case 11155111: return 'Sepolia';
    //   case 137: return 'Polygon';
    //   default: return 'Unknown';
    // }
  };

  if (!wallet.isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={wallet.isConnecting}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:from-gray-600 disabled:to-gray-600"
      >
        <Wallet className="w-4 h-4" />
        <span>{wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-gray-800/50 border border-gray-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700/50 transition-all duration-300"
      >
        <Wallet className="w-4 h-4 text-green-400" />
        <span>{formatAddress(wallet.address!)}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Wallet Address</span>
              <button
                onClick={copyAddress}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg mb-4">
              <p className="text-white font-mono text-sm break-all">{wallet.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-400">Balance</span>
                <p className="text-white font-semibold">{wallet.balance} ETH</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Network</span>
                <p className="text-white font-semibold">
                  {wallet.chainId ? getNetworkName() : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  window.open(`https://etherscan.io/address/${wallet.address}`, '_blank');
                  setShowDropdown(false);
                }}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">View on Explorer</span>
              </button>
              <button
                onClick={() => {
                  disconnectWallet();
                  setShowDropdown(false);
                }}
                className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};