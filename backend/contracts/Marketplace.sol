// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

    
contract Marketplace is Ownable, ReentrancyGuard {
    uint256 public client_stake_per;
    uint256 public freelancer_stake_per;
    uint256 public platform_fee_per;
    uint256 public MINIMUM_BUDGET;
    uint256 public totalPlatformFees;
    uint256 public cancelJobPenaltyPer;
    mapping(address => uint256[]) internal clientJobs;
    mapping(address => uint256[]) internal freelancerJobs;
    mapping(uint256 => address[]) internal jobApplications;
    mapping(uint256 => mapping(address => bool)) public hasApplied;


    struct Job {
        address client;
        address freelancer;
        string title;
        string description;
        string on_completion;        
        uint256 budget;
        uint256 client_stake;
        uint256 freelancer_stake; 
        uint256 platform_fee;
        uint256 createdAt;
        uint256 deadline;
        JobStatus status; 
        bool exists;
        string submissionHash;
        string public_review;
        uint8 rating;
        bool isPaid;
        bool reviewed;
    }
    
    mapping(uint256 => Job) internal jobs;
    uint256 public jobCounter=0;

    enum JobStatus { Open, Assigned, RequestPending ,InReview, Completed, Paid , NotCompleted, Cancelled }

    constructor(uint256 _MINIMUM_BUDGET, uint256 _client_stake_per, uint256 _freelancer_stake_per, uint256 _platform_fee_per, uint256 _penalty_per) Ownable(msg.sender) {
        client_stake_per = _client_stake_per;
        freelancer_stake_per = _freelancer_stake_per;
        platform_fee_per = _platform_fee_per;
        cancelJobPenaltyPer = _penalty_per;
        MINIMUM_BUDGET = _MINIMUM_BUDGET;
    }


    event JobCreated(uint256 jobId, address indexed client, string description, uint256 budget, uint256 createdAt, uint256 deadline);
    event JobAssigned(uint256 jobId, address indexed freelancer);
    event JobCompleted(uint256 jobId, address indexed freelancer);
    event JobRevoked(uint256 jobId, address indexed client);
    event JobNotCompleted(uint256 jobId);
    event AmountPaidOnCompletion(uint256 jobId, address indexed freelancer, uint256 amount);
    event JobAccepted(uint256 jobId, address indexed freelancer);
    event JobDeleted(uint256 jobId, address indexed client);
    event FundsWithdrawnByOwner(address owner, uint256 amount);
    event FreelancerReviewed(uint256 indexed jobId,string public_review, uint8 rating);
    event AppliedForJob(uint256 indexed jobId, address indexed freelancer);
    event SubmissionSubmitted(uint256 indexed jobId, string submissionHash, address indexed freelancer);

    //  funds withdrawal by owner
    function withdrawPlatformFees() external onlyOwner {

        require(totalPlatformFees > 0, "No platform fees to withdraw");
        uint256 amount = totalPlatformFees;
        totalPlatformFees = 0;
        (bool sent1, ) = payable(owner()).call{value: amount}("");
        require(sent1, "Failed to withdraw platform fees");
        emit FundsWithdrawnByOwner(owner(), amount);
    }
    // some imp functionality to transfer ownership
    function changeOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0) && newOwner != owner(), "Invalid new owner address or new owner is same as current owner");
        transferOwnership(newOwner);
        emit OwnershipTransferred(owner(), newOwner);
    }

    // setters
    function setClientStakePercentage(uint256 _client_stake_per) external onlyOwner {
        client_stake_per = _client_stake_per;
    }

    function setFreelancerStakePercentage(uint256 _freelancer_stake_per) external onlyOwner {
        freelancer_stake_per = _freelancer_stake_per;
    }

    function setPlatformFeePercentage(uint256 _platform_fee_per) external onlyOwner {
        platform_fee_per = _platform_fee_per;
    }

    function setMinimumBudget(uint256 _minimum_budget) external onlyOwner {
        require(_minimum_budget > 100000, "Minimum budget must be greater than 100000 wei");
        MINIMUM_BUDGET = _minimum_budget;
    }

    function setCancelJobPenaltyPercentage(uint256 _penalty_per) external onlyOwner {
        require(0 <= _penalty_per && _penalty_per <= 100, "Penalty percentage must be between 0 and 100");
        cancelJobPenaltyPer = _penalty_per;
    }

    // getters
    function getSubmissionHash(uint256 jobId) external view returns (string memory) {
        return jobs[jobId].submissionHash;
    }

    function getTotalPlatformFees() external view returns (uint256) {
        return totalPlatformFees;
    }
    function getClientStakePercentage() external view returns (uint256) {
        return client_stake_per;
    }

    function getFreelancerStakePercentage() external view returns (uint256) {
        return freelancer_stake_per;
    }

    function getPlatformFeePercentage() external view returns (uint256) {
        return platform_fee_per;
    }

    function getMinimumBudget() external view returns (uint256) {
        return MINIMUM_BUDGET;
    }

    function getAllJobs() external view returns (Job[] memory) {
        // logic to return all jobs
        Job[] memory allJobs = new Job[](jobCounter);
        for (uint256 i = 0; i < jobCounter; i++) {
            allJobs[i] = jobs[i];
        }
        return allJobs;
    }

    function getJobById(uint256 jobId) external view jobExists(jobId) returns (Job memory) {
        // logic to return a specific job by its ID
        return jobs[jobId];
    }
    
    function getClientsAllPostings() external view returns (uint256[] memory) {
        return clientJobs[msg.sender];
    }
        
    function getClientJobs(address client) external view returns (uint256[] memory) {
        return clientJobs[client];
    }
    
    function getFreelancerJobs(address freelancer) external view returns (uint256[] memory) {
        return freelancerJobs[freelancer];
    }

    function getJobApplications(uint256 jobId) external view jobExists(jobId) returns (address[] memory) {
        return jobApplications[jobId];
    }

    function hasFreelancerApplied(uint256 jobId, address freelancer) external view jobExists(jobId) returns (bool) {
        return hasApplied[jobId][freelancer];
    }

    modifier onlyFreelancer(uint256 jobId) {
        require(jobs[jobId].freelancer == msg.sender, "Only the assigned freelancer can perform this action");
        _;
    }

    modifier onlyClient(uint256 jobId) {
        require(jobs[jobId].client == msg.sender, "Only the client can perform this action");
        _;
    }
    modifier jobExists(uint256 jobId) {
        require(jobId < jobCounter && jobs[jobId].exists, "Job does not exist");
        _;
    }
    modifier validFreelancer(uint256 jobId) {
        require(jobs[jobId].freelancer != address(0), "Freelancer not assigned yet");
        _;
    }

    // actual logic
    function createJob(string memory _title, uint256 _duration, string memory _description) external payable returns (uint256) {
        // logic for creating a job
        require(msg.value >= MINIMUM_BUDGET, "Must send some greater than MINIMUM_BUDGET wei");

        uint256 _budget= msg.value;
        uint256 _client_stake = (client_stake_per * _budget) / 100;
        uint256 _freelancer_stake = (freelancer_stake_per * _budget) / 100;
        uint256 _platform_fee = (platform_fee_per * _budget) / 100;
        uint256 _final_budget = _budget - _client_stake - _platform_fee;

        require(_final_budget > MINIMUM_BUDGET, "Final budget < minimum budget");

        Job memory newJob = Job({
            client: msg.sender,
            freelancer: address(0),
            title: _title,
            description: _description,
            on_completion: "",
            budget: _final_budget,
            client_stake: _client_stake, 
            freelancer_stake: _freelancer_stake,
            platform_fee: _platform_fee,
            createdAt : block.timestamp,
            deadline: block.timestamp + (_duration * 1 days),
            status: JobStatus.Open,
            isPaid: false,
            reviewed: false,
            submissionHash:"",
            public_review: "",
            rating: 0,
            exists: true
        });
        jobs[jobCounter] = newJob;
        clientJobs[msg.sender].push(jobCounter);
        totalPlatformFees += _platform_fee;
        jobCounter++;

        emit JobCreated(jobCounter-1, msg.sender, _description, _budget, block.timestamp, block.timestamp + (_duration * 1 days));
        return jobCounter-1;
    }   

    function acceptJob(uint256 jobId) public payable jobExists(jobId) onlyFreelancer(jobId) {
        // logic for accepting a job
        require(msg.value == jobs[jobId].freelancer_stake , "Must send required ETH for stake");
        require(jobs[jobId].status == JobStatus.RequestPending , "Job is not pending");
        jobs[jobId].status = JobStatus.Assigned;
        emit JobAccepted(jobId, msg.sender);
    }

    function applyForJob(uint256 jobId) public jobExists(jobId)  {
        require(jobs[jobId].status == JobStatus.Open, "Job is not open for applications");
        require(msg.sender != jobs[jobId].client, "Client cannot apply for their own job");
        require(!hasApplied[jobId][msg.sender], "Freelancer has already applied for this job");
        hasApplied[jobId][msg.sender] = true;
        jobApplications[jobId].push(msg.sender);
    
        emit AppliedForJob(jobId, msg.sender);
    }
    
    function assignJob(uint256 jobId, address freelancer) public jobExists(jobId) onlyClient(jobId) {
        // logic for assigning a job to a freelancer
        require(jobs[jobId].status == JobStatus.Open , "Job is not open for assignment");

        jobs[jobId].freelancer = freelancer;
        jobs[jobId].status = JobStatus.RequestPending ;
        freelancerJobs[freelancer].push(jobId);
        emit JobAssigned(jobId, freelancer);
    }

    function revokeJobAssigned(uint256 jobId) public jobExists(jobId) onlyClient(jobId) {
        require(jobs[jobId].status == JobStatus.Assigned, "Job is not assigned");
        (bool sent1, ) = payable(jobs[jobId].freelancer).call{value : jobs[jobId].freelancer_stake}("");
        require(sent1, "Failed to send freelancer stake when job is revoked");
        jobs[jobId].freelancer = address(0);
        jobs[jobId].status = JobStatus.Open;
        emit JobRevoked(jobId, msg.sender);
    }

    function submitSubmission(uint256 jobId, string memory _submissionHash) public jobExists(jobId) onlyFreelancer(jobId) {
        require(jobs[jobId].status == JobStatus.Assigned, "Job is not assigned");
        jobs[jobId].submissionHash = _submissionHash;
        jobs[jobId].status = JobStatus.InReview;
        emit SubmissionSubmitted(jobId, _submissionHash, msg.sender);
    }

    function editSubmission(uint256 jobId, string memory _submissionHash) public jobExists(jobId) onlyFreelancer(jobId) {
        require(jobs[jobId].status == JobStatus.InReview, "Job is not in review");
        jobs[jobId].submissionHash = _submissionHash;
        emit SubmissionSubmitted(jobId, _submissionHash, msg.sender);
    }

    function completeJob(uint256 jobId,string memory _reply_on_completion) public jobExists(jobId) onlyClient(jobId) {
        // complete the job
        require(jobs[jobId].status == JobStatus.InReview, "Job is not in review");
        jobs[jobId].on_completion=_reply_on_completion;
        jobs[jobId].status = JobStatus.Completed;
        emit JobCompleted(jobId, msg.sender);
    }

    function payOnCompletion(uint256 jobId) public jobExists(jobId) validFreelancer(jobId) {
        // logic for paying the freelancer upon job completion
        require(msg.sender == jobs[jobId].client, "Only the client can pay on completion");
        require(jobs[jobId].status == JobStatus.Completed, "Job is not completed yet");
        require(jobs[jobId].isPaid == false, "Already paid");
        jobs[jobId].status = JobStatus.Paid;

        uint256 toPayFreelancer = jobs[jobId].budget + jobs[jobId].freelancer_stake;
        (bool sent1, ) = payable(jobs[jobId].freelancer).call{value: toPayFreelancer}("");
        require(sent1, "Failed to pay freelancer");
        (bool sent2, ) = payable(jobs[jobId].client).call{value: jobs[jobId].client_stake}("");
        require (sent2 , "Failed to send client stake");
        // emit an event for job payment
        emit AmountPaidOnCompletion(jobId,jobs[jobId].freelancer, toPayFreelancer);
    }

    function reviewFreelancer(uint256 jobId, string memory _public_review, uint8 _rating) public jobExists(jobId) onlyClient(jobId) {
        // logic for reviewing the freelancer
        require(jobs[jobId].status == JobStatus.Paid, "Job is not paid yet");
        require(!jobs[jobId].reviewed, "Freelancer already reviewed");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");

        jobs[jobId].public_review = _public_review;
        jobs[jobId].rating = _rating;
        jobs[jobId].reviewed = true;
        emit FreelancerReviewed(jobId, _public_review, _rating);
    }

    function checkDeadlinePassed(uint256 jobId) public view jobExists(jobId) returns (bool) {
        return block.timestamp > jobs[jobId].deadline;
    }

    function deadlinePassed(uint256 jobId) public jobExists(jobId) {
        // pay the client and cut the platform fee
        require(checkDeadlinePassed(jobId), "Deadline has not passed yet");
        address contractOwner = owner();
        // mark the status as NotCompleted 
        jobs[jobId].status = JobStatus.NotCompleted;
        
        (bool sent1, ) = payable(contractOwner).call{value: jobs[jobId].platform_fee }("");
        require(sent1, "Failed to send platform fee to owner");
        (bool sent2, ) = payable(jobs[jobId].client).call{value : jobs[jobId].client_stake+jobs[jobId].freelancer_stake}("");
        require(sent2, "Failed to send client stake and freelancer stake to client");
        // emit an event for job not completed
        emit JobNotCompleted(jobId);
    }

    function cancelJob(uint256 jobId) public jobExists(jobId)  onlyClient(jobId) {
        require(jobs[jobId].status == JobStatus.Open, "Job is not open for cancellation");
        
        jobs[jobId].status = JobStatus.Cancelled;
        uint256 totalRefund = jobs[jobId].budget + jobs[jobId].client_stake;
        uint256 penaltyAmount = (cancelJobPenaltyPer * totalRefund) / 100;
        totalRefund -= penaltyAmount;
        totalPlatformFees += penaltyAmount;
        jobs[jobId].exists = false;

        // clear all the freelancers that applied for the job
        delete jobApplications[jobId];

        // return the budget and client stake back to the client
        (bool sent1, ) = payable(jobs[jobId].client).call{value: totalRefund}("");
        require(sent1, "Failed to refund client");
        emit JobDeleted(jobId, msg.sender);
    }
}