import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Clock, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useMarketplaceContract } from '@/hooks/useMarketplaceContract';
import { useLocation } from 'react-router-dom';
import { SuccessModal } from '@/components/modals/SuccessModal';
import { UserLoader } from './loaders/UserLoader';
import { createJob } from '@/services/MarketplaceServices';
  import { ErrorModal } from '@/components/modals/ErrorModal';


export const CreateJob: React.FC = () => {
  const { user, wallet, loadingUser } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    duration: '7'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);



  const contract = useMarketplaceContract();

  const [clientStakePer, setClientStakePer] = useState<number | null>(null);
  const [freelancerStakePer, setFreelancerStakePer] = useState<number | null>(null);
  const [platformFeePer, setPlatformFeePer] = useState<number | null>(null);
  const [minBudget, setMinBudget] = useState<number | null>(null);

  const location = useLocation();

  React.useEffect(() => {
    const fetchSettings = async () => {
      if (!contract) return;
      try {
        const [
          clientStakePer,
          freelancerStakePer,
          platformFeePer,
          minBudgetValue
        ] = await Promise.all([
          contract.getClientStakePercentage(),
          contract.getFreelancerStakePercentage(),
          contract.getPlatformFeePercentage(),
          contract.getMinBudget()
        ]);
        setClientStakePer(clientStakePer.toNumber());
        setFreelancerStakePer(freelancerStakePer.toNumber());
        setPlatformFeePer(platformFeePer.toNumber());
        setMinBudget(minBudgetValue.toNumber());
      } catch (err) {
        // fallback to defaults if error
        setClientStakePer(20);
        setFreelancerStakePer(20);
        setPlatformFeePer(10);
        setMinBudget(0.00000000000001);
      }
    };
    fetchSettings();
  }, [contract, location.key]);

  // Mock platform settings
  const platformSettings = {
    clientStakePercent: clientStakePer ? clientStakePer : 20,
    freelancerStakePercent: freelancerStakePer ? freelancerStakePer: 20,
    platformFeePercent: platformFeePer ? platformFeePer : 10,
    minimumBudget: minBudget ? minBudget : 0.000000000000001
  };

  const budgetETH = parseFloat(formData.budget) || 0;
  const clientStake = budgetETH * (platformSettings.clientStakePercent / 100);
  const freelancerStake = budgetETH * (platformSettings.freelancerStakePercent / 100);
  const platformFee = budgetETH * (platformSettings.platformFeePercent / 100);
  const finalBudget = budgetETH - clientStake - platformFee;
  const totalRequired = budgetETH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || budgetETH < platformSettings.minimumBudget) return;

    setIsSubmitting(true);

    try {
      if (contract) {
        const jobId = await createJob(
          contract,
          formData.title,
          Number(formData.duration),
          formData.description,
          formData.budget
        );
        setCreatedJobId(jobId ? jobId.toString() : null);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.log(error);
      setShowError(true);
    }finally {
      setIsSubmitting(false);
      setFormData({
        title: '',
        description: '',
        budget: '',
        duration: '7'
      });
      // navigate('/dashboard');
    }
  };

  return loadingUser ? (
    <UserLoader />
  ) : (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Post a New Job</h1>
          <p className="text-gray-400">Create a detailed job posting to attract the right talent</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Build a Modern E-commerce Website"
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your project in detail, including requirements, deliverables, and any specific skills needed..."
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                      Budget (ETH) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        type="number"
                        id="budget"
                        required
                        min={platformSettings.minimumBudget}
                        step="0.01"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="5.0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Minimum: {platformSettings.minimumBudget} ETH
                    </p>
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
                      Duration (Days) *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        type="number"
                        id="duration"
                        required
                        min="1"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || budgetETH < platformSettings.minimumBudget || !wallet.wallet.isConnected}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
                >
                  {!wallet.wallet.isConnected 
                    ? 'Connect Wallet to Post Job' 
                    : isSubmitting 
                    ? 'Creating Job...' 
                    : `Post Job (${totalRequired.toFixed(3)} ETH)`
                  }
                </button>
                
                {!wallet.wallet.isConnected && (
                  <p className="text-sm text-yellow-400 text-center mt-2">
                    Please connect your wallet to post a job
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Cost Breakdown */}
          <div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 text-blue-400 mr-2" />
                Cost Breakdown
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-sm text-gray-400">Total Budget</span>
                  <span className="font-medium text-white">{budgetETH.toFixed(3)} ETH</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-sm text-gray-400">Client Stake ({platformSettings.clientStakePercent}%)</span>
                  <span className="text-orange-600">-{clientStake.toFixed(3)} ETH</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-sm text-gray-400">Platform Fee ({platformSettings.platformFeePercent}%)</span>
                  <span className="text-orange-600">-{platformFee.toFixed(3)} ETH</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-sm text-gray-400">Freelancer Stake ({platformSettings.freelancerStakePercent}%)</span>
                  <span className="text-orange-600">-{freelancerStake.toFixed(3)} ETH</span>
                </div>

                <div className="flex justify-between items-center py-2 font-semibold">
                  <span className="text-white">Freelancer Gets</span>
                  <span className="text-emerald-600">{finalBudget.toFixed(3)} ETH</span>
                </div>

                <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">How it works:</h4>
                  <ul className="text-xs text-blue-200 space-y-1">
                    <li>• Connect your wallet to interact with smart contracts</li>
                    <li>• Your stake is returned when job completes</li>
                    <li>• Freelancer pays stake to accept job</li>
                    <li>• Stakes ensure commitment from both parties</li>
                    <li>• Platform fee is collected upfront</li>
                  </ul>
                </div>

                <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                  <h4 className="text-sm font-semibold text-yellow-300 mb-2">Required Stake:</h4>
                  <p className="text-xs text-yellow-200">
                    Freelancer must stake {freelancerStake.toFixed(3)} ETH to accept this job.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {showError && (
      <ErrorModal
        message="Error Posting Job"
        onClose={() => setShowError(false)}
      />
    )}

    {showSuccessModal && (
      <SuccessModal
        title={formData.title}
        jobId={createdJobId}
        onClose={() => setShowSuccessModal(false)}
      />
    )}
    </div>
  );
};