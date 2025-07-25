import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield } from 'lucide-react';

interface AcceptSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  stakeAmount: number;
}

const AcceptSuccessModal: React.FC<AcceptSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  jobTitle, 
  stakeAmount 
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-emerald-500/50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-green-600/5 to-emerald-600/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
        
        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Success Icon with animation */}
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute top-4 left-8 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
          <div className="absolute top-12 right-6 w-1 h-1 bg-green-400 rounded-full animate-ping delay-75"></div>
          <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping delay-150"></div>
          
          {/* Main heading */}
          <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            🎉 Congratulations!
          </h3>
          
          {/* Success message */}
          <p className="text-lg text-emerald-300 font-semibold mb-2">
            Job Offer Accepted Successfully!
          </p>
          
          {/* Job details */}
          <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4 mb-6">
            <p className="text-emerald-200 text-sm mb-2">
              You're now working on:
            </p>
            <p className="text-white font-semibold text-base mb-3">
              "{jobTitle}"
            </p>
            
            {/* Stake info */}
            <div className="flex items-center justify-center space-x-2 text-emerald-300 text-sm">
              <Shield className="w-4 h-4" />
              <span>Stake: {stakeAmount.toFixed(3)} ETH secured</span>
            </div>
          </div>
          
          {/* Next steps */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 mb-6">
            <h4 className="text-emerald-300 font-semibold mb-2 text-sm">What's Next?</h4>
            <div className="text-gray-300 text-xs space-y-1 text-left">
              <p>✅ Your stake has been secured</p>
              <p>✅ Client has been notified</p>
              <p>🚀 You can now start working on the project</p>
              <p>💰 Payment will be released upon completion</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                navigate('/marketplace');
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
            >
              Go to Dashboard
            </button>
            <button
              onClick={onClose}
              className="w-full border border-emerald-600/50 text-emerald-300 hover:text-white hover:bg-emerald-600/20 py-2 px-6 rounded-lg font-medium transition-all duration-300"
            >
              Continue Viewing Job
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
      </div>
    </div>
  );
};

export default AcceptSuccessModal;
