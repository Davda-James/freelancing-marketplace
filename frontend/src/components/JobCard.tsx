import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, User, Star } from 'lucide-react';
import { JobStatus } from '@/types';
import type { Job } from "@/types"
import { useApp } from '@/context/AppContext';
import { formatEther } from 'ethers';
import { getStatusLabel } from '@/lib/utils';
import { revokeJob } from '@/services/MarketplaceServices';
import RevokeModal from '@/components/modals/RevokeModal';
import { toast } from 'react-hot-toast';

export interface JobCardProps {
  job: Job;
  onJobClick?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { user, contract, refreshJobs } = useApp();
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const getStatusColor = (status: JobStatus | "Unknown") => {
    switch (status) {
      case JobStatus.Open:
        return 'bg-green-100 text-green-800';
      case JobStatus.Assigned:
        return 'bg-blue-100 text-blue-800';
      case JobStatus.InReview:
        return 'bg-yellow-100 text-yellow-800';
      case JobStatus.Completed:
        return 'bg-purple-100 text-purple-800';
      case JobStatus.Paid:
        return 'bg-emerald-100 text-emerald-800';
      case JobStatus.NotCompleted:
        return 'bg-red-100 text-red-800';
      case JobStatus.Cancelled:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: number | bigint) => {
    const ms = Number(timestamp) * 1000;
    return new Date(ms).toLocaleDateString();
  };

  const daysUntilDeadline = Math.ceil(
    (Number(job.deadline) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const statusLabel = getStatusLabel(job.status);
  const isClient = user?.address?.toLowerCase() === job.client.toLowerCase();
  const isFreelancer = user?.address?.toLowerCase() === job.freelancer?.toLowerCase();
  const canRevoke = isClient && statusLabel === JobStatus.Assigned && job.freelancer;

  const handleRevoke = async () => {
    if (!contract || !canRevoke) return;
    try {
      setIsRevoking(true);
      await revokeJob(contract, job.id);
      toast.success('Job assignment revoked successfully');
      setShowRevokeModal(false);
      await refreshJobs();
    } catch (error) {
      console.error('Error revoking job:', error);
      toast.error('Failed to revoke job assignment');
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <Link to={`/job/${job.id}`}>
      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-blue-500/10 group min-h-[300px] flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white line-clamp-2">{job.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusLabel)}`}>
          {statusLabel}
        </span>
      </div>

      <p className="text-gray-400 mb-4 line-clamp-3">{job.description}</p>

      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
        <div className="flex items-center space-x-1">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-emerald-600">{Number(formatEther(job.budget)).toFixed(4)} ETH</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Overdue'}</span>
        </div>
        <div className="flex items-center space-x-1">
          <User className="w-4 h-4" />
          <button
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(job.client);
            }}
            title="Click to copy"
            className="text-gray-400 hover:text-gray-200 cursor-pointer text-sm transition-colors"
          >
              <span>Client: {job.client.slice(0, 6)}...{job.client.slice(-4)}</span>
          </button>
        </div>
      </div>

      {statusLabel === JobStatus.Completed && job.rating && job.rating > 0 && (
        <div className="flex items-center space-x-1 mb-4">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
          <span className="text-sm text-yellow-300 font-medium">
            {job.rating}/5 rating
          </span>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
        <span className="text-sm text-gray-500">
          Posted: {formatDate(job.createdAt)}
        </span>
        <div className="flex space-x-2">
          {isClient && statusLabel === JobStatus.Open && (
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Manage
            </button>
          )}
          {canRevoke && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                setShowRevokeModal(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            >
              Revoke
            </button>
          )}
          {isFreelancer && statusLabel === JobStatus.Open && (
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 group-hover:scale-105">
              Apply Now 
            </button>
          )}
        </div>
      </div>
      </div>
      
      {/* Revoke Modal */}
      <RevokeModal
        isOpen={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        onConfirm={handleRevoke}
        jobTitle={job.title}
        freelancerAddress={job.freelancer || ''}
        clientAddress={job.client}
        isRevoking={isRevoking}
      />
    </Link>
  );
};