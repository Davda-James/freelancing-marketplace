import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { JobCard } from './JobCard';
import { formatEther } from 'ethers';
import { 
  User, 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  Star, 
  Briefcase, 
  DollarSign,
  TrendingUp,
  Award,
  Search
} from 'lucide-react';
import { JobStatus } from '@/types';
import type { Job } from '@/types';
import { getStatusLabel } from '@/lib/utils';
import { getJobsOfFreelancer } from '@/services/MarketplaceServices';


export const FreelancerPortfolio: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const { user, contract } = useApp();
  const [loading, setLoading] = useState(true);
  const [freelancerJobs, setFreelancerJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    totalEarned: '0',
    averageRating: 0,
    activeJobs: 0
  });

  useEffect(() => {
    const fetchFreelancerJobs = async () => {
      if (!address || !contract) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch jobs directly for this freelancer
        const jobs = await getJobsOfFreelancer(contract, address);
        
        // Calculate stats
        const completedJobs = jobs.filter(job => 
          getStatusLabel(job.status) === JobStatus.Completed || getStatusLabel(job.status) === JobStatus.Paid
        );
        
        const activeJobs = jobs.filter(job => {
          const status = getStatusLabel(job.status);
          return status === JobStatus.Assigned || status === JobStatus.InReview;
        });

        const totalEarned = completedJobs.reduce((sum, job) => {
          return sum + Number(formatEther(job.budget));
        }, 0);

        const ratedJobs = jobs.filter(job => job.rating && job.rating > 0);
        const averageRating = ratedJobs.length > 0 
          ? ratedJobs.reduce((sum, job) => sum + (job.rating || 0), 0) / ratedJobs.length 
          : 0;

        setFreelancerJobs(jobs);
        setStats({
          totalJobs: jobs.length,
          completedJobs: completedJobs.length,
          totalEarned: totalEarned.toFixed(4),
          averageRating: Number(averageRating.toFixed(1)),
          activeJobs: activeJobs.length
        });
      } catch (error) {
        console.error('Error fetching freelancer jobs:', error);
        setFreelancerJobs([]);
        setStats({
          totalJobs: 0,
          completedJobs: 0,
          totalEarned: '0',
          averageRating: 0,
          activeJobs: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerJobs();
  }, [address, contract]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // You could add a toast notification here
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const isOwnProfile = user?.address ? user?.address.toLowerCase() === address?.toLowerCase() : false;

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Address</h1>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          {/* Freelancer Info Card */}
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-white">
                      {isOwnProfile ? 'Your Portfolio' : 'Freelancer Portfolio'}
                    </h1>
                    {stats.averageRating > 0 && (
                      <div className="flex items-center space-x-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-300 font-medium">{stats.averageRating}/5</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Address Display */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={copyAddress}
                      className="group flex items-center space-x-2 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-600/50 hover:border-gray-500/70 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                      title="Click to copy address"
                    >
                      <span className="text-gray-300 font-mono text-sm">{formatAddress(address)}</span>
                      <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-200" />
                    </button>
                    
                    <a
                      href={`https://etherscan.io/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                      title="View on Etherscan"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">View on Explorer</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex-1 lg:ml-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                    <Briefcase className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.totalJobs}</div>
                    <div className="text-sm text-blue-300">Total Jobs</div>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                    <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.completedJobs}</div>
                    <div className="text-sm text-green-300">Completed</div>
                  </div>
                  
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
                    <DollarSign className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.totalEarned}</div>
                    <div className="text-sm text-purple-300">ETH Earned</div>
                  </div>
                  
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.activeJobs}</div>
                    <div className="text-sm text-orange-300">Active Jobs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-6 h-6" />
              <span>Job History</span>
            </h2>
            {isOwnProfile && (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View Full Dashboard
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Loading portfolio...</p>
            </div>
          ) : freelancerJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freelancerJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800/50">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {isOwnProfile ? 'No Jobs Yet' : 'No Portfolio Data'}
              </h3>
              <p className="text-gray-400 mb-6">
                {isOwnProfile 
                  ? 'Start applying for jobs to build your portfolio!' 
                  : 'This freelancer hasn\'t completed any jobs yet.'
                }
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/marketplace')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Browse Jobs
                </button>
              )}
              {!isOwnProfile && (
                <button
                  onClick={() => navigate('/portfolio-search')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  Search Other Freelancers
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};