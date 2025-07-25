// ShowApplicants.tsx
import React, { useEffect, useState } from 'react';
import { assignJob } from '@/services/MarketplaceServices';
import { AlertTriangle, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface ShowApplicantsProps {
    applicants: string[];
    jobId: number;
    onClose: () => void;
    onSuccess: (freelancerAddress: string) => void;
}

const ShowApplicants: React.FC<ShowApplicantsProps> = ({ applicants, jobId, onClose, onSuccess }) => {
  const { contract } = useApp();
  const [filteredFreelancers, setFilteredFreelancers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    // Use the applicants prop directly instead of fetching again
    setFilteredFreelancers(applicants);
  }, [applicants]);

  // Filter freelancers based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFreelancers(applicants);
    } else {
      const filtered = applicants.filter(freelancer =>
        freelancer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFreelancers(filtered);
    }
  }, [searchTerm, applicants]);

  const handleAssign = async () => {
    if (!contract || !selectedFreelancer) return;
    try {
      setIsAssigning(true);
      await assignJob(contract, jobId, selectedFreelancer);
      onSuccess(selectedFreelancer);
    } catch (err) {
        console.error("Failed to assign freelancer");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden transition-opacity duration-200 animate-fade-in"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside modal
      >
        {/* Header - Fixed */}
        <div className="p-6 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white mb-4">Select a Freelancer</h2>
          
          {/* Search/Filter Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {filteredFreelancers.length === 0 ? (
            <div className="text-gray-300 flex items-center space-x-2 justify-center py-8">
              <AlertTriangle className="text-yellow-400 w-5 h-5" />
              <span>
                {searchTerm ? `No applicants found matching "${searchTerm}"` : "No applicants available."}
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFreelancers.map((freelancer) => (
                <div 
                  key={freelancer} 
                  className={`bg-gray-800 rounded-lg p-4 border cursor-pointer transition-all duration-200 ${
                    selectedFreelancer === freelancer 
                      ? 'border-blue-500 bg-gray-700/50 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-600 hover:bg-gray-750'
                  }`}
                  onClick={() => setSelectedFreelancer(freelancer)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                        selectedFreelancer === freelancer 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-500'
                      }`}>
                        {selectedFreelancer === freelancer && (
                          <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{freelancer.slice(0, 6)}...{freelancer.slice(-4)}</p>
                        <p className="text-xs text-gray-400">Ethereum Address</p>
                      </div>
                    </div>
                    <button 
                      className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to portfolio - you can implement this
                        console.log('View portfolio for:', freelancer);
                      }}
                    >
                      View Portfolio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t border-gray-800 flex justify-between items-center flex-shrink-0">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            Close
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedFreelancer || isAssigning}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedFreelancer && !isAssigning
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAssigning ? 'Assigning...' : selectedFreelancer ? `Assign ${selectedFreelancer.slice(0,6)}...` : 'Select a Freelancer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowApplicants;
