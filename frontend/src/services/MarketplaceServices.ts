import  { Contract } from 'ethers';
import { ethers } from 'ethers'; 
import type { Job } from '@/types';

export const getAllJobs = async (contract: Contract): Promise<Job[]> => {
  const rawJobs = await contract.getAllJobs();
  return rawJobs.map((job: any, index : number) => ({
    id: index,
    client: job.client,
    freelancer: job.freelancer,
    title: job.title,
    description: job.description,
    onCompletion: job.on_completion,
    budget: job.budget,
    clientStake: job.client_stake,
    freelancerStake: job.freelancer_stake,
    platformFee: job.platform_fee,
    createdAt: job.createdAt.toNumber ? job.createdAt.toNumber() : job.createdAt,
    deadline: job.deadline.toNumber ? job.deadline.toNumber() : job.deadline,
    status: Number(job.status),
    exists: job.exists,
    submissionHash: job.submissionHash,
    publicReview: job.public_review,
    rating: Number(job.rating),
    isPaid: job.isPaid,
    reviewed: job.reviewed
  }));
};

export const createJob = async (contract: Contract, 
  title: string,
  duration: number,
  description: string,
  budget: string
) : Promise<number> => {
  const tx = await contract.createJob(title,duration, description, {value: ethers.parseEther(budget)});
  const receipt = await tx.wait();
  const _logs = receipt.logs;
  let jobId: number | undefined = undefined;
  for(const log of  _logs){
    try{
      const parsed = contract.interface.parseLog(log);
      if(parsed?.name === 'JobCreated') {
        jobId = Number(parsed?.args[0]);
      }
    }catch (error) {
      continue;
    }
  }
  return jobId ?? -1;
}

export const getPlatformStakePer = async (contract: Contract): Promise<number> => {
  const platformStakePer = await contract.getPlatformFeePercentage();
  return platformStakePer.toNumber ? platformStakePer.toNumber() : platformStakePer;
};

export const getFreelancerStakePer = async (contract: Contract): Promise<number> => {
  const freelancerStakePer = await contract.getFreelancerStakePercentage();
  return freelancerStakePer.toNumber ? freelancerStakePer.toNumber() : freelancerStakePer;
};

export const getClientStakePer = async (contract: Contract): Promise<number> => {
  const clientStakePer = await contract.getClientStakePercentage();
  return clientStakePer.toNumber ? clientStakePer.toNumber() : clientStakePer;
};

export const getMinBudget = async (contract: Contract): Promise<number> => {  
  const getMinBudget = await contract.getMinBudget();
  return getMinBudget.toNumber ? getMinBudget.toNumber() : getMinBudget;
};

export const getJobById = async (contract: Contract, jobId: number): Promise<Job | null> => {
  try{
    const rawJob = await contract.getJobById(jobId);
    return {
      id: jobId,
      client: rawJob.client,
      freelancer: rawJob.freelancer,
      title: rawJob.title,
      description: rawJob.description,
      onCompletion: rawJob.on_completion,
      budget: rawJob.budget,
      clientStake: rawJob.client_stake,
      freelancerStake: rawJob.freelancer_stake,
      platformFee: rawJob.platform_fee,
      createdAt: rawJob.createdAt.toNumber ? rawJob.createdAt.toNumber() : rawJob.createdAt,
      deadline: rawJob.deadline.toNumber ? rawJob.deadline.toNumber() : rawJob.deadline,
      status: Number(rawJob.status),
      exists: rawJob.exists,
      submissionHash: rawJob.submissionHash,
      publicReview: rawJob.public_review,
      rating: Number(rawJob.rating),
      isPaid: rawJob.isPaid,
      reviewed: rawJob.reviewed
    };
  } catch (error) {
    return null;  
  }
}
export const getJobsOfFreelancer = async (contract: Contract, freelancer: string): Promise<Job[]> => {
  const jobIds = await contract.getFreelancerJobs(freelancer);
  const jobs: Job[] = [];
  for( const jobId of jobIds) {
    const job = await getJobById(contract, Number(jobId));
    if (job) {
      jobs.push(job);
    }
  }
  return jobs;
};

export const getJobsOfClient = async (contract: Contract, client: string): Promise<Job[]> => {  
  const jobIds = await contract.getClientJobs(client);
  const jobs: Job[] = [];
  for (const jobId of jobIds) {
    const job = await getJobById(contract, Number(jobId));
    if (job) {
      jobs.push(job);
    }
  }
  return jobs;
};

export const getApplicationsForJob = async (contract: Contract, jobId: number): Promise<string[]> => {
  const applications = await contract.getJobApplications(jobId);
  return applications;
};

export const ApplyForJob = async (contract: Contract , jobId: number): Promise<boolean> => {
  try {
    const tx = await contract.applyForJob(jobId);
    await tx.wait();
    return true;
  } catch(error) {
    throw error;
  }
};

export const  isAlreadyApplied = async (contract: Contract, freelancerAddress : string ) : Promise<boolean> => {
  try {
    const jobApplications =  await contract.getJobApplications(freelancerAddress);
    for(const address of jobApplications) {
      if (address.toLowerCase() === freelancerAddress.toLowerCase()) {
        return true;
      }
    }
    return false;
  } catch( error ) {
    throw error;
  }
};

export const assignJob = async (contract: Contract, jobId: number, freelancerAddress: string): Promise<boolean> => {
  try {
    const tx = await contract.assignJob(jobId, freelancerAddress);
    await tx.wait();
    return true;
  } catch (error) {
    throw error;
  }
};

export const revokeJob = async (contract: Contract, jobId: number): Promise<boolean> => {
  try {
    const tx = await contract.revokeJobAssigned(jobId);
    await tx.wait();
    return true;
  } catch (error) {
    throw error;
  }
};

export const acceptJob = async (contract: Contract, jobId: number, stakeAmount: string): Promise<boolean> => {
  try {
    const tx = await contract.acceptJob(jobId, {
      value: ethers.parseEther(stakeAmount)
    });
    await tx.wait();
    return true;
  } catch (error) {
    throw error;
  }
};

export const cancelJob = async (contract: Contract, jobId: number): Promise<boolean> => {
  try {
    const tx = await contract.cancelJob(jobId);
    await tx.wait();
    return true;
  } catch (error) {
    throw error;
  }
};


export const submitSubmission = async (contract: Contract, jobId: number, submissionHash: string): Promise<boolean> => {
  try {
    const tx= await  contract.submitSubmission(jobId, submissionHash);
    await tx.wait();
    return true;
  } catch (error) {
    throw error;
  } 
};  

export  const editSubmission = async (contract: Contract, jobId: number, submissionHash:  string): Promise<boolean> => {
  try {
    const tx= await contract.editSubmission(jobId, submissionHash);
    await tx.wait();
    return true;
  } catch (error) {
    throw error;
  }
};

export const getSubmissionHash = async (contract: Contract, jobId: number): Promise<string> => {
  try{
    const submissionHash = await contract.getSubmissionHash(jobId);
    return submissionHash;
  } catch (error){
    throw error;
  }
};

export const completeJob = async (contract:Contract , jobId:number, completionMessage: string ): Promise<boolean> => {
  try {
    const tx = await contract.completeJob(jobId, completionMessage);
    await tx.wait();
    return true;
  } catch (error) {
    throw error;
  }
};

export const approvePayment = async (contract: Contract, jobId: number): Promise<boolean> => {
  try {
    const tx= await contract.payOnCompletion(jobId);
    await tx.wait();
    return true;
  } catch (error) {
    throw error;
  }
};

export const reviewFreelancer = async (contract: Contract, jobId: number, rating: number, publicReview: string): Promise<boolean> => {
  try {
    const tx = await contract.reviewFreelancer(jobId, publicReview, rating);
    await tx.wait();
    return true;
  } catch (error) {
    throw error;
  }
};
