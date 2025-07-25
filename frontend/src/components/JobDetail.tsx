import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, DollarSign, User, Shield, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import {  JobStatus } from '@/types';
import { useApp } from '@/context/AppContext';
import { getStatusLabel } from '@/lib/utils';
import { getApplicationsForJob, ApplyForJob, assignJob, acceptJob, revokeJob, cancelJob } from '@/services/MarketplaceServices';
import { formatEther } from 'ethers';
import ShowApplicants from '@/components/modals/ShowApplicants';
import AcceptSuccessModal from '@/components/modals/AcceptSuccessModal';
import RevokeModal from '@/components/modals/RevokeModal';
import CancelJobModal from '@/components/modals/CancelJobModal';

export const JobDetail: React.FC = () => {
const { user, jobs, contract, refreshJobs } = useApp();
const { id } = useParams<{ id: string }>();
const navigate = useNavigate();
const [isApplying, setIsApplying] = useState(false);
// const [showStakeModal, setShowStakeModal] = useState(false);
const [applicants, setApplicants] = useState<string[]>([]);
const [loadingApplicants, setLoadingApplicants] = useState(false);
const [showAssignModal, setShowAssignModal] = useState(false);
const [assignedFreelancer, setAssignedFreelancer] = useState<string | null>(null);
const [showAppliedModal, setShowAppliedModal] = useState(false);
const [assigningFreelancer, setAssigningFreelancer] = useState<string | null>(null);
const [isAcceptingOffer, setIsAcceptingOffer] = useState(false);
const [showAcceptSuccessModal, setShowAcceptSuccessModal] = useState(false);
const [showRevokeModal, setShowRevokeModal] = useState(false);
const [isRevoking, setIsRevoking] = useState(false);
const [showCancelJobModal, setShowCancelJobModal] = useState(false);
const [isCancelling, setIsCancelling] = useState(false);

const job = jobs.find(j => j.id === parseInt(id || '0'));

// Add debug logging to see if job status is updating
useEffect(() => {
  if (job) {
    console.log('Job status updated:', getStatusLabel(job.status), 'for job ID:', job.id);
  }
}, [job?.status]);

useEffect(() => {
  if(!job || !contract) return;
  const fetchApplications = async () => {
    setLoadingApplicants(true);
    try {
      const res = await getApplicationsForJob(contract,job.id);
      setApplicants(res);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingApplicants(false);
    }
  };
  fetchApplications();
}, [id, job?.id, contract]);

if (!job || !user || !contract) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Job Not Found</h1>
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
const formatDate = (timestamp: number) => {
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const deadlineTimestamp = Number(job.deadline);
const daysUntilDeadline = Math.ceil((deadlineTimestamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
const budgetETH = parseFloat(formatEther(job.budget));
const stakeETH = parseFloat(formatEther(job.freelancerStake));

const getStatusInfo = (status: JobStatus | "Unknown") => {
  switch (status) {
    case JobStatus.Open:
      return { color: 'text-green-600 bg-green-100', text: 'Open for Applications' };
    case JobStatus.RequestPending:
      return { color: 'text-yellow-600 bg-yellow-100', text: 'Application Pending' };
    case JobStatus.Assigned:
      return { color: 'text-blue-600 bg-blue-100', text: 'In Progress' };
    case JobStatus.InReview:
      return { color: 'text-purple-600 bg-purple-100', text: 'Under Review' };
    case JobStatus.Completed:
      return { color: 'text-emerald-600 bg-emerald-100', text: 'Completed' };
    case JobStatus.Paid:
      return { color: 'text-green-600 bg-green-100', text: 'Paid' };
    case JobStatus.Cancelled:
      return { color: 'text-red-600 bg-red-100', text: 'Cancelled' };
    default:
      return { color: 'text-gray-600 bg-gray-100', text: status };
  }
};

const statusInfo = getStatusInfo(getStatusLabel(job.status));
const isClient = job.client.toLowerCase() === user?.address?.toLowerCase();
const isFreelancer = !isClient;
const isMyJob = isClient;
const isAlreadyApplied = user?.address ? applicants.map(addr => addr.toLowerCase()).includes(user.address.toLowerCase()) : false;
const isAssignedFreelancer = user?.address && job.freelancer ? job.freelancer.toLowerCase() === user.address.toLowerCase() : false;
const canAcceptOffer = isFreelancer && getStatusLabel(job.status) === JobStatus.RequestPending && isAssignedFreelancer;
const canApply = isFreelancer && getStatusLabel(job.status) === JobStatus.Open && job.freelancer !== user?.address && !isAlreadyApplied;
const canRevoke = isClient && getStatusLabel(job.status) === JobStatus.Assigned && job.freelancer;
const canCancelJob = isClient && getStatusLabel(job.status) === JobStatus.Open;

const handleApply = async () => {   
  if (!canApply) return;
  setIsApplying(true);
  
  try {
    await ApplyForJob(contract, job.id);
    const res = await getApplicationsForJob(contract, job.id);
    await refreshJobs();
    setApplicants(res);

    setShowAppliedModal(true);
  } catch (error) {
    console.error('Error applying for job:', error);

  } finally {
    setIsApplying(false);
  }
};

const handleAssignFreelancer = async (freelancerAddress: string) => {
  if (!contract) return;
  try {
    setAssigningFreelancer(freelancerAddress);
    console.log('Before assignment - Job status:', getStatusLabel(job.status));
    await assignJob(contract, job.id, freelancerAddress);
    console.log('Assignment completed, refreshing jobs...');
    // Refresh jobs to update status - this should change job.status and hide the assignment buttons
    await refreshJobs();
    console.log('Jobs refreshed - Job status should now be:', getStatusLabel(job.status));
    setAssignedFreelancer(freelancerAddress);
  } catch (error) {
    console.error('Error assigning freelancer:', error);
  } finally {
    setAssigningFreelancer(null);
  }
};

const handleAcceptOffer = async () => {
  if (!contract || !canAcceptOffer) return;
  try {
    setIsAcceptingOffer(true);
    // Accept the job with the required stake amount
    await acceptJob(contract, job.id, stakeETH.toString());
    setShowAcceptSuccessModal(true);
    // Refresh jobs to update status
    await refreshJobs();
  } catch (error) {
    console.error('Error accepting offer:', error);
  } finally {
    setIsAcceptingOffer(false);
  }
};

const handleRevoke = async () => {
  if (!contract || !canRevoke) return;
  try {
    setIsRevoking(true);
    await revokeJob(contract, job.id);
    setShowRevokeModal(false);
    await refreshJobs();
  } catch (error) {
    console.error('Error revoking job:', error);
  } finally {
    setIsRevoking(false);
  }
};

const handleCancelJob = async () => {
  if (!contract || !canCancelJob) return;
  try {
    setIsCancelling(true);
    await cancelJob(contract, job.id);
    setShowCancelJobModal(false);
    await refreshJobs();
    // Navigate back to marketplace after successful cancellation
    navigate('/marketplace');
  } catch (error) {
    console.error('Error cancelling job:', error);
  } finally {
    setIsCancelling(false);
  }
};

return (
  <div className="min-h-screen bg-gray-950">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Jobs</span>
        </button>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Job ID: #{job.id}</span>
              <span>Posted: {formatDate(job.createdAt)}</span>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color} whitespace-nowrap`}>
            {statusInfo.text}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Description */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Job Description</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Client Information</h2>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(job.client);
                      // Show visual feedback
                      const button = document.activeElement as HTMLButtonElement;
                      if (button) {
                        const originalText = button.textContent;
                        button.textContent = 'Copied!';
                        button.classList.add('!text-green-400', '!bg-green-900/30', 'scale-105');
                        setTimeout(() => {
                          button.textContent = originalText;
                          button.classList.remove('!text-green-400', '!bg-green-900/30', 'scale-105');
                        }, 1500);
                      }
                    }}                 
                    className="relative group font-medium text-white text-left focus:outline-none 
                              bg-gray-800/50 hover:bg-gray-700/60 
                              border border-gray-700/50 hover:border-gray-600/70
                              px-3 py-2 rounded-lg
                              transition-all duration-200 ease-in-out
                              hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20
                              active:scale-95 active:bg-blue-900/40
                              cursor-pointer select-none"
                    title="Click to copy client address"
                    >
                    <span className="relative z-10">
                      {job.client.slice(0, 6)}...{job.client.slice(-4)}
                    </span>
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 
                                  rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {/* Copy icon appears on hover */}
                    <div className="absolute -right-2 -top-2 w-4 h-4 bg-blue-600 rounded-full 
                                  flex items-center justify-center opacity-0 group-hover:opacity-100 
                                  transition-all duration-200 scale-75 group-hover:scale-100">
                      <span className="text-white text-xs">📋</span>
                    </div>
                </button>
                <p className="text-sm text-gray-400 mt-1">Ethereum Address</p>
              </div>
            </div>
          </div>

          {/* Timeline & Progress */}
          {getStatusLabel(job.status) !== JobStatus.Open && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Progress Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-300">Job posted</span>
                  <span className="text-sm text-gray-400">{formatDate(job.createdAt)}</span>
                </div>
                
                {getStatusLabel(job.status) === JobStatus.Assigned && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-300">Freelancer assigned</span>
                  </div>
                )}
                
                {(getStatusLabel(job.status) === JobStatus.Completed || getStatusLabel(job.status) === JobStatus.Paid) && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-300">Work completed</span>
                  </div>
                )}
                
                {getStatusLabel(job.status) === JobStatus.Paid && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-300">Payment completed</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Job Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Budget</span>
                </div>
                <span className="font-semibold text-emerald-600">{budgetETH.toFixed(3)} ETH</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Deadline</span>
                </div>
                <span className={`text-sm ${daysUntilDeadline > 0 ? 'text-gray-300' : 'text-red-400'}`}>
                  {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Overdue'}
                </span>
              </div>

              {isFreelancer && canApply && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Required Stake</span>
                  </div>
                  <span className="font-semibold text-orange-600">{stakeETH.toFixed(3)} ETH</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isFreelancer && (
            <div className="mt-6 space-y-3">
              <button
                onClick={handleApply}
                disabled={!canApply || isApplying}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg
                  ${
                    canApply
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25'
                      : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {isApplying ? 'Processing...' : isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
              </button>
              
              {/* Accept Offer Button - Only for assigned freelancer */}
              {canAcceptOffer && (
                <button
                  onClick={handleAcceptOffer}
                  disabled={isAcceptingOffer}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg
                    ${
                      !isAcceptingOffer
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 hover:shadow-emerald-500/25'
                        : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isAcceptingOffer ? 'Accepting...' : 'Accept Offer'}
                </button>
              )}
            </div>
            )}

            {isMyJob && getStatusLabel(job.status) === JobStatus.Open && (
              <div className="mt-6 space-y-3">
                <button 
                  onClick={() => setShowAssignModal(true)}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Assign Freelancer
                </button>
                <button className="w-full border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  Edit Job
                </button>
                {canCancelJob && (
                  <button 
                    onClick={() => setShowCancelJobModal(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25 border border-red-600"
                  >
                    Cancel Job
                  </button>
                )}
              </div>
            )}

            {canRevoke && (
              <div className="mt-6">
                <button 
                  onClick={() => setShowRevokeModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                >
                  Revoke Assignment
                </button>
              </div>
            )}

            {isMyJob && getStatusLabel(job.status) === JobStatus.InReview && (
              <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Review Submission
              </button>
            )}

            {isMyJob && getStatusLabel(job.status) === JobStatus.Completed && (
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Release Payment
              </button>
            )}
          </div>

          {/* Stake Information */}
          {(isFreelancer || isMyJob) && (
            <div className={`border rounded-xl p-6 ${
              canAcceptOffer 
                ? 'bg-emerald-900/20 border-emerald-700/50' 
                : 'bg-yellow-900/20 border-yellow-700/50'
            }`}>
              <div className="flex items-start space-x-3">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  canAcceptOffer ? 'text-emerald-400' : 'text-yellow-400'
                }`} />
                <div>
                  <h4 className={`text-sm font-semibold mb-2 ${
                    canAcceptOffer ? 'text-emerald-300' : 'text-yellow-300'
                  }`}>
                    {canAcceptOffer ? 'You\'ve Been Selected!' : 'Stake Requirements'}
                  </h4>
                  <div className={`text-sm space-y-1 ${
                    canAcceptOffer ? 'text-emerald-200' : 'text-yellow-200'
                  }`}>
                    {isFreelancer && !canAcceptOffer && (
                      <>
                        <p>• No stake is needed to apply</p>
                        <p>• Stake of {stakeETH.toFixed(3)} ETH will be required if you're assigned and accepted the offer</p>
                        <p>• Shows your commitment to the project</p>
                      </>
                    )}
                    {canAcceptOffer && (
                      <>
                        <p>🎉 You've been selected for this job!</p>
                        <p>• Required stake: {stakeETH.toFixed(3)} ETH</p>
                        <p>• Click "Accept Offer" to confirm and start working</p>
                        <p>• Your stake will be returned upon job completion</p>
                      </>
                    )}
                    {isMyJob && (
                      <>
                        <p>• Your stake: {parseFloat(formatEther(job.clientStake)).toFixed(3)} ETH</p>
                        <p>• Returned when job completes successfully</p>
                        <p>• Freelancer must stake {stakeETH.toFixed(3)} ETH</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          {job.reviewed && job.rating && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Client Review</h3>
              <div className="flex items-center space-x-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < job.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-400">({job.rating}/5)</span>
              </div>
              {job.publicReview && (
                <p className="text-sm text-gray-300">{job.publicReview}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Stake Confirmation Modal */}
    {/* {showStakeModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Confirm Application</h3>
          <div className="space-y-4 mb-6">
            <div className="bg-blue-900/20 border border-blue-700/30 p-4 rounded-lg">
              <h4 className="font-medium text-blue-300 mb-2">Stake Details</h4>
              <div className="text-sm text-blue-200 space-y-1">
                <p>Amount: {stakeETH.toFixed(3)} ETH</p>
                <p>Purpose: Job commitment stake</p>
                <p>Returned: Upon job completion</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              By confirming, you agree to stake {stakeETH.toFixed(3)} ETH for this job. 
              This shows your commitment and will be returned when the job is completed.
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowStakeModal(false)}
              className="flex-1 border border-gray-700 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStakeConfirm}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Confirm & Apply
            </button>
          </div>
        </div>
      </div>
    )} */}

    {/* freelancers applications  */}
    {applicants.length > 0 && getStatusLabel(job.status) !== JobStatus.Cancelled && (
      <div className="mt-16 max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Freelancer Applications</h2>
        <div className="space-y-4">
          {applicants.map((freelancer, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-center justify-between bg-gray-900 border border-gray-700/60 rounded-xl px-6 py-4 
                        shadow-md hover:shadow-purple-500/20 transition duration-300"
            >
              {/* Left side (address and label) */}
              <div className="flex items-center space-x-4 mb-2 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {freelancer.slice(0, 6)}...{freelancer.slice(-4)}
                  </p>
                  <p className="text-xs text-gray-400">Ethereum Address</p>
                </div>
              </div>

              {/* Right side (actions) */}
              <div className="flex items-center space-x-3">
                <button
                  className="bg-gray-800 text-gray-200 hover:bg-gray-700 px-4 py-2 text-sm rounded-md transition-colors"
                  onClick={() => navigator.clipboard.writeText(freelancer)}
                >
                  Copy
                </button>
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 text-sm rounded-md transition-colors"
                  onClick={() => navigate(`/portfolio/${freelancer}`)}
                >
                  View Portfolio
                </button>
                {isMyJob && getStatusLabel(job.status) === JobStatus.Open && (
                  <button
                    onClick={() => handleAssignFreelancer(freelancer)}
                    disabled={assigningFreelancer === freelancer}
                    className={`px-4 py-2 text-sm rounded-md font-medium transition-all duration-200 ${
                      assigningFreelancer === freelancer
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25'
                    }`}
                  >
                    {assigningFreelancer === freelancer ? 'Assigning...' : 'Assign'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}


    {/* No applicants message */}
    {!loadingApplicants && applicants.length === 0 && getStatusLabel(job.status) !== JobStatus.Cancelled && (
      <div className="mt-12 flex flex-col items-center justify-center bg-gray-900 border border-gray-800 rounded-xl p-8 text-center shadow-lg">
        <AlertTriangle className="w-8 h-8 text-yellow-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Applications Yet</h3>
        <p className="text-gray-400 text-sm max-w-md">
          Freelancers haven't applied to this job yet. Once someone stakes and applies, their profile will appear here.
        </p>
      </div>
    )}

    {assignedFreelancer && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
          <h3 className="text-xl text-white font-semibold mb-2">Successfully Assigned</h3>
          <p className="text-gray-300 mb-2">
            Job #{job.id} assigned to <span className="text-blue-400">{assignedFreelancer.slice(0, 6)}...{assignedFreelancer.slice(-4)}</span>
          </p>
          <button onClick={() => setAssignedFreelancer(null)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            OK
          </button>
        </div>
      </div>
    )}

    {showAssignModal && (
      <ShowApplicants
        applicants={applicants}
        jobId={job.id}
        onClose={() => setShowAssignModal(false)}
        onSuccess={(freelancer: string) => {
          setAssignedFreelancer(freelancer);
          setShowAssignModal(false);
        }}
      />
    )}

    {showAppliedModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
          <h3 className="text-xl text-white font-semibold mb-2">Application Submitted</h3>
          <p className="text-gray-300 mb-4">
            You've successfully applied for <span className="text-blue-400">{job.title}</span>!
          </p>
          <button onClick={() => setShowAppliedModal(false)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            OK
          </button>
        </div>
      </div>
    )}

    {/* Success Modal for Accepting Job Offer */}
    <AcceptSuccessModal
      isOpen={showAcceptSuccessModal}
      onClose={() => setShowAcceptSuccessModal(false)}
      jobTitle={job.title}
      stakeAmount={stakeETH}
    />

    {/* Revoke Assignment Modal */}
    <RevokeModal
      isOpen={showRevokeModal}
      onClose={() => setShowRevokeModal(false)}
      onConfirm={handleRevoke}
      jobTitle={job.title}
      freelancerAddress={job.freelancer || ''}
      clientAddress={job.client}
      isRevoking={isRevoking}
    />

    {/* Cancel Job Modal */}
    <CancelJobModal
      isOpen={showCancelJobModal}
      onClose={() => setShowCancelJobModal(false)}
      onConfirm={handleCancelJob}
      jobTitle={job.title}
      clientAddress={job.client}
      isCancelling={isCancelling}
    />

  </div>
  );
};