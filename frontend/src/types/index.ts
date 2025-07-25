  export interface Job {
    id: number;
    client: string;
    freelancer?: string;
    title: string;
    description: string;
    onCompletion?: string;
    budget: number;
    clientStake: number;
    freelancerStake: number;
    platformFee: number;
    createdAt: number;
    deadline: number;
    status: number;
    exists: boolean;
    publicReview?: string;
    rating?: number;
    isPaid: boolean;
    reviewed: boolean;
  }
  
  export enum JobStatus {
    Open = 'Open',
    Assigned = 'Assigned',
    RequestPending = 'RequestPending',
    InReview = 'InReview',
    Completed = 'Completed',
    Paid = 'Paid',
    NotCompleted = 'NotCompleted',
    Cancelled = 'Cancelled'
  }
  
  export const JobStatusLabels = [
    JobStatus.Open,           // 0
    JobStatus.Assigned,       // 1
    JobStatus.RequestPending, // 2
    JobStatus.InReview,       // 3
    JobStatus.Completed,      // 4
    JobStatus.Paid,           // 5
    JobStatus.NotCompleted,   // 6
    JobStatus.Cancelled       // 7
  ];

  export interface User {
    id: string;
    address?: string; 
    email: string;
    name?: string;
    avatar?: string;
  }
  
  export interface PlatformStats {
    totalJobs: number;
    activeJobs: number;
    totalFreelancers: number;
    platformFees: number;
  }