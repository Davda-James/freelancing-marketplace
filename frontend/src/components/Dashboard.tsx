import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, DollarSign, Clock, Star, TrendingUp, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { JobCard } from '@/components/JobCard';
import { JobStatus } from '@/types';
import type { Job } from '@/types';
import { getJobsOfFreelancer, getJobsOfClient } from '@/services/MarketplaceServices';
import { useMarketplaceContract } from '@/hooks/useMarketplaceContract';
import { getStatusLabel } from '@/lib/utils';
import { formatEther } from 'ethers';

interface DashboardProps {
  onViewChange: (view: string, job?: Job) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
    const { user, refreshJobs } = useApp();
    const navigate = useNavigate();
    const [myJobs, setMyJobs] = useState<Job[]>([]);
    const [JobsPosted, setJobsPosted] = useState<Job[]>([]);
    // user jobs as well 
    const [activeTab, setActiveTab] = useState('overview');

    const contract = useMarketplaceContract();
    useEffect(() => {
        const fetchJobs = async () => {
            if (!user?.address || !contract) return;
            try {
                // Refresh global jobs list when dashboard loads
                await refreshJobs();
                
                // Fetch user-specific jobs
                const jobsPosted = await getJobsOfClient(contract, user?.address);
                const freelancerJobs = await getJobsOfFreelancer(contract, user?.address);
                setJobsPosted(jobsPosted);
                setMyJobs(freelancerJobs);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            }
        };
        fetchJobs();
    }, [user?.address, contract, refreshJobs]);

    const stats = {
        totalJobs: myJobs.length,
        activeJobs: myJobs.filter(job => getStatusLabel(job.status) === JobStatus.Assigned).length,
        totalEarned: myJobs.reduce((acc, job) => acc + Number(formatEther(job.budget)), 0),
        totalSpent: JobsPosted.reduce((acc,job) => {
            const budget = parseFloat(formatEther(job.budget));
            const fee = parseFloat(formatEther(job.platformFee));
            return acc + budget + fee;
        },0),
        jobsPosted: JobsPosted.length,
        successRate: myJobs.length > 0 ? (myJobs.filter(job => getStatusLabel(job.status) === JobStatus.Completed).length / myJobs.length) * 100 : 0,
        avgRating: myJobs.length > 0 ? (myJobs.reduce((acc, job) => acc + (job.rating || 0), 0) / myJobs.length).toFixed(1) : 'N/A'
    };
    return (
        <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back !! 
            </h1>
            <p className="text-gray-400">Manage your projects and track your progress.</p>
            </div>

            {/* Stats Grid */}
            {/* Jobs as Freelancer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">Jobs as Freelancer</p>
                    <p className="text-2xl font-bold text-white">{stats.totalJobs}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                </div>
                </div>
            </div>

            {/* Jobs Posted by user */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">Jobs Posted</p>
                    <p className="text-2xl font-bold text-white">{stats.jobsPosted}</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                </div>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">Active Jobs</p>
                    <p className="text-2xl font-bold text-white">{stats.activeJobs}</p>
                </div>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                </div>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">Total Earned</p>
                    <p className="text-2xl font-bold text-white">
                        {stats.totalEarned.toFixed(2)} ETH
                    </p>

                    <p className="text-sm font-medium text-gray-400 mt-4">Total Spent</p>
                    <p className="text-2xl font-bold text-white">
                        {stats.totalSpent.toFixed(2)} ETH
                    </p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                </div>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">Avg Rating</p>
                    <p className="text-2xl font-bold text-white">{stats.avgRating}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-lg">
                    <Star className="w-6 h-6 text-white" />
                </div>
                </div>
            </div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 mb-8">
            <div className="border-b border-gray-700">
                <nav className="flex space-x-8 px-6">
                {[
                    { id: 'overview', label: 'Overview', icon: TrendingUp },
                    { id: 'myJobs', label: 'My Jobs', icon: Briefcase },
                    {id: 'jobsPosted', label: 'Jobs Posted', icon: Briefcase},
                    { id: 'profile', label: 'Profile', icon: Users },
                ].map(tab => (
                    <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                        ? 'border-blue-400 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                    >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    </button>
                ))}
                </nav>
            </div>

            <div className="p-6">
                {activeTab === 'overview' && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                    {myJobs.slice(0, 3).map(job => (
                        <div key={job.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                        <div>
                            <h4 className="font-medium text-white">{job.title}</h4>
                            <p className="text-sm text-gray-400">Status: {getStatusLabel(job.status)}</p>
                        </div>
                        <span className="text-sm text-gray-400">
                            {parseFloat(formatEther(job.budget)).toFixed(2)} ETH
                        </span>
                        </div>
                    ))}
                    </div>
                </div>
                )}

                {activeTab === 'myJobs' && (
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">Jobs as Freelancer</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {myJobs.map((job) => (
                            <JobCard
                            key={`freelancer-${job.id}`}
                            job={job}
                            onJobClick={(job) => onViewChange('job-detail', job)}
                            />
                        ))}
                        </div>
                        {myJobs.length === 0 && (
                        <div className="text-center py-8 text-gray-400">You haven't accepted any jobs yet.</div>
                        )}
                    </div>
                )}

                {activeTab === 'jobsPosted' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white">Jobs You Posted</h3>
                        <button
                            onClick={() => navigate('/create-job')}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                        >
                            Post New Job
                        </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {JobsPosted.map((job) => (
                            <JobCard
                            key={`client-${job.id}`}
                            job={job}
                            onJobClick={(job) => onViewChange('job-detail', job)}
                            />
                        ))}
                        </div>
                        {JobsPosted.length === 0 && (
                        <div className="text-center py-8 text-gray-400">You haven't posted any jobs yet.</div>
                        )}
                    </div>
                )}
                   
                {activeTab === 'profile' && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Profile Settings</h3>
                    <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                        Wallet Address
                        </label>
                        <input
                        type="text"
                        value={user?.address || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                        Display Name
                        </label>
                        <input
                        type="text"
                        value= {!user?.name || user.name.trim().toLowerCase() === "null" || user.name.trim().toLowerCase() === "null null"
                                ? "N/A"
                                : user.name}
                        disabled
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    </div>
                </div>
                )}
            </div>
            </div>
        </div>
        </div>
    );
    };