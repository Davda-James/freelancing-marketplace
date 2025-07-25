import React from 'react';
import { Link } from 'react-router-dom';
import { SignUpButton, useUser } from '@clerk/clerk-react';
import { Search, ArrowRight, Star, Users, Briefcase } from 'lucide-react';

// Check if Clerk is enabled
const isClerkEnabled = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.startsWith('pk_');

export const Hero: React.FC = () => {
  const { isSignedIn } = isClerkEnabled ? useUser() : { isSignedIn: false };

  return (
    <div className="relative bg-gray-950 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Decentralized
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-pulse"> Freelance </span>
            Marketplace
          </h1>
          <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
            Connect with top talent on a secure, transparent platform powered by blockchain. 
            No middlemen, fair payments, and complete project security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isSignedIn && isClerkEnabled ? (
                <Link
                    to="/create-job"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-xl hover:shadow-blue-500/25 group"
                    >
                    <span>Post a Job</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
            ) : (
              <>
                {isClerkEnabled ? (
                  <SignUpButton mode="modal">
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-xl hover:shadow-blue-500/25 group">
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </SignUpButton>
                ) : (
                  <Link
                    to="/marketplace"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-xl hover:shadow-blue-500/25 group"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                )}
              </>
            )}
            <Link
              to="/marketplace"
              className="border-2 border-gray-700 text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg hover:border-blue-400 hover:text-blue-400 hover:bg-gray-800/50 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm group"
            >
              <Search className="w-5 h-5" />
              <span>Browse Jobs</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">10,000+ Jobs</h3>
              <p className="text-gray-400">Active projects across various industries</p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">50,000+ Freelancers</h3>
              <p className="text-gray-400">Skilled professionals ready to work</p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">4.9/5 Rating</h3>
              <p className="text-gray-400">Trusted by thousands of users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};