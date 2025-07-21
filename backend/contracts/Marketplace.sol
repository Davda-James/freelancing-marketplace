// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract Marketplace is Ownable {

    uint256 public client_stake_per;
    uint256 public freelancer_stake_per;
    uint256 public platform_fee_per;
    uint256 public MINIMUM_BUDGET;
    uint256 public totalPlatformFees;


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
        string public_review;
        uint8 rating;
        bool isPaid;
        bool reviewed;

    }

    mapping(uint256 => Job) private jobs;
    uint256 private jobCounter=0;
    
    constructor(uint256 _MINIMUM_BUDGET, uint256 _client_stake_per, uint256 _freelancer_stake_per, uint256 _platform_fee_per) Ownable(msg.sender) {
        client_stake_per = _client_stake_per;
        freelancer_stake_per = _freelancer_stake_per;
        platform_fee_per = _platform_fee_per;
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
    event JobReOpened(uint256 jobId, address indexed client, string description, uint256 budget, uint256 createdAt, uint256 deadline);
    event FundsWithdrawnByOwner(address owner, uint256 amount);
    event FreelancerReviewed(uint256 indexed jobId,string public_review, uint8 rating);
    event JobReviewed(uint256 indexed jobId, address indexed client,address indexed freelancer, string result);
    
    enum JobStatus { Open, Assigned, RequestPending ,InReview, Completed, Paid , NotCompleted }
    

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

    // getters
    // not sure to keep this 
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

    function getAllJobs() public view returns (Job[] memory) {
        // logic to return all jobs
        Job[] memory allJobs = new Job[](jobCounter);
        for (uint256 i = 0; i < jobCounter; i++) {
            allJobs[i] = jobs[i];
        }
        return allJobs;
    }

    function getJobById(uint256 jobId) public view returns (Job memory) {
        // logic to return a specific job by its ID
        require(jobId < jobCounter, "Job does not exist");
        return jobs[jobId];
    }

    modifier onlyFreelancer(uint256 jobId) {
        require(jobs[jobId].freelancer == msg.sender, "Only the assigned freelancer can perform this action");
        _;
    }

    modifier onlyClient(uint256 jobId) {
        require(jobId < jobCounter, "Job does not exist");
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
            public_review: "",
            rating: 0,
            exists: true
        });
        jobs[jobCounter] = newJob;
        totalPlatformFees += _platform_fee;
        jobCounter++;
        emit JobCreated(jobCounter - 1, msg.sender, _description, _budget, block.timestamp, block.timestamp + (_duration * 1 days));
        return jobCounter-1;
    }   

    function acceptJob(uint256 jobId) public payable jobExists(jobId) onlyFreelancer(jobId) {
        // logic for accepting a job
        require(msg.value == jobs[jobId].freelancer_stake , "Must send required ETH for stake");
        require(jobs[jobId].status == JobStatus.RequestPending , "Job is not pending");
        jobs[jobId].status = JobStatus.Assigned;
        emit JobAccepted(jobId, msg.sender);
    }

    function assignJob(uint256 jobId, address freelancer) public jobExists(jobId) onlyClient(jobId) {
        // logic for assigning a job to a freelancer
        require(jobs[jobId].status == JobStatus.Open , "Job is not open for assignment");

        jobs[jobId].freelancer = freelancer;
        jobs[jobId].status = JobStatus.RequestPending ;
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

    function requestJobReview (uint256 jobId, string memory _result) public jobExists(jobId) onlyFreelancer(jobId) {
        // logic for reviewing a job
        require(jobs[jobId].status == JobStatus.Assigned, "Job is not assigned");
        require(jobs[jobId].freelancer != address(0), "Freelancer not assigned yet");
        jobs[jobId].status = JobStatus.InReview;
        emit JobReviewed(jobId, jobs[jobId].client ,jobs[jobId].freelancer, _result);
    }

    function completeJob(uint256 jobId,string memory _reply_on_completion) public jobExists(jobId) onlyClient(jobId) {
        // complete the job
        require(jobs[jobId].status == JobStatus.Assigned, "Job is not assigned");
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

    function reOpenJob(uint256 jobId,uint256 _duration,string memory _description) public payable jobExists(jobId) onlyClient(jobId) {
        // logic to reopen a job
        require(jobs[jobId].status == JobStatus.NotCompleted , "Job is not in a state that can be reopened");
        require(msg.value >= MINIMUM_BUDGET, "send eth greater than 100000 wei");

        uint256 _budget = msg.value;
        uint256 _client_stake = (client_stake_per * _budget) / 100;
        uint256 _freelancer_stake = (freelancer_stake_per * _budget) / 100;
        uint256 _platform_fee = (platform_fee_per * _budget) / 100;
        uint256 _final_budget = _budget - _client_stake - _platform_fee;

        require(_final_budget > MINIMUM_BUDGET, "Final budget < minimum budget");   

        jobs[jobId].budget = _final_budget;
        jobs[jobId].client_stake = _client_stake;
        jobs[jobId].freelancer_stake = _freelancer_stake;
        jobs[jobId].platform_fee = _platform_fee;
        jobs[jobId].status = JobStatus.Open;
        jobs[jobId].description  = _description;
        jobs[jobId].createdAt = block.timestamp;
        jobs[jobId].deadline = block.timestamp + (_duration * 1 days);
        totalPlatformFees += _platform_fee;
        emit JobReOpened(jobId, msg.sender, _description, _budget, block.timestamp, block.timestamp + (_duration * 1 days));
    }

    function cancelJob(uint256 jobId) public jobExists(jobId)  onlyClient(jobId) {
        require(jobs[jobId].status == JobStatus.Open, "Job is not open for cancellation");
        
        uint256 totalRefund = jobs[jobId].budget + jobs[jobId].client_stake;
        // delete the job
        delete jobs[jobId];
        jobs[jobId].exists = false;

        // return the budget and client stake back to the client
        (bool sent1, ) = payable(jobs[jobId].client).call{value: totalRefund}("");
        require(sent1, "Failed to refund client");
        emit JobDeleted(jobId, msg.sender);
    }
}