import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { isAddress } from 'ethers';

export const PortfolioSearch: React.FC = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchAddress.trim()) {
      setError('Please enter an address');
      return;
    }

    if (!isAddress(searchAddress.trim())) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    setError('');
    navigate(`/portfolio/${searchAddress.trim()}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Find Top{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Freelancers
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover talented freelancers by exploring their work history, ratings, and completed projects.
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-8 shadow-xl">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-3">
                Freelancer Ethereum Address
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="address"
                  type="text"
                  value={searchAddress}
                  onChange={handleInputChange}
                  placeholder="0x1234567890abcdef1234567890abcdef12345678"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    error 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-700/50 focus:ring-blue-500/50 hover:border-gray-600/70'
                  }`}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{error}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!searchAddress.trim()}
              className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                !searchAddress.trim()
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105'
              }`}
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-medium text-white mb-1">Search</h4>
                <p className="text-sm text-gray-400">Enter any Ethereum address</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-medium text-white mb-1">Explore</h4>
                <p className="text-sm text-gray-400">View their job history & stats</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowRight className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="font-medium text-white mb-1">Connect</h4>
                <p className="text-sm text-gray-400">See their work quality & ratings</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};