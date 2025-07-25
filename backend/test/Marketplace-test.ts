import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "hardhat";
import type { Signer } from  "ethers";


describe("Marketplace", function () { 
    let marketplace : any;
    let owner : Signer, client: Signer,freelancer: Signer;
    const title = "Test Job"
    const description = "This is a test job"
    const duration = 7
    // includes the client stake and platform fee
    const total_budget = hre.ethers.parseEther("1") 
    const minimumBudget = hre.ethers.parseEther("0.1")
    const clientStakePer = 20n
    const freelancerStakePer = 20n
    const freelancerStake = (total_budget * freelancerStakePer) / (100n)
    const platformFeePer = 10n
    const penaltyPer = 5n
    before(async function() {
        // get signers
        [ owner , client, freelancer] = await hre.ethers.getSigners();
    
        // deploy the contract
        const Marketplace = await ethers.getContractFactory("Marketplace",owner);
        marketplace = await Marketplace.deploy(minimumBudget, clientStakePer, freelancerStakePer, platformFeePer, penaltyPer);
        await marketplace.waitForDeployment();
    })
    let jobId: bigint;

    beforeEach(async function(){
        jobId = await createJobAndGetId();
    })

    async function createJobAndGetId() : Promise<bigint> {
        const tx = await marketplace.connect(client).createJob(title, duration, description, {
            value: total_budget
        })
        const receipt = await tx.wait();
        const logs = receipt.logs;
        let _event;
        for(const event of logs) {
            if(event.fragment && event.fragment.name === "JobCreated") {
                _event = event;
                break;
            }
        }
        const jobId = _event?.args?.jobId;
        expect(jobId).to.not.be.undefined;
        await expect(marketplace.connect(client).createJob(title, duration, description,{
            value: total_budget
        })).to.emit(marketplace,  "JobCreated");
        return jobId;
    }
    async function assignJobAndExpectEvent(jobId: bigint) : Promise<void> {
        await expect(marketplace.connect(client).assignJob(jobId, freelancer.getAddress())).to.emit(marketplace, "JobAssigned").withArgs(jobId, freelancer.getAddress());
    }

    it("createJob", async function() { 
        await expect(marketplace.connect(client).createJob(title, duration, description,{
            value: total_budget
        })).to.emit(marketplace,  "JobCreated");
    })

    it("assignJob", async function() {
        await assignJobAndExpectEvent(jobId);
    })

    it("acceptJob", async function() {
        await assignJobAndExpectEvent(jobId);
        await expect(marketplace.connect(freelancer).acceptJob(jobId,{ value: freelancerStake })).to.emit(marketplace, "JobAccepted").withArgs(jobId, freelancer.getAddress());
    })
    it("revokeJobAssigned", async function(){
        await assignJobAndExpectEvent(jobId);
        await expect(marketplace.connect(freelancer).acceptJob(jobId,{ value: freelancerStake })).to.emit(marketplace, "JobAccepted").withArgs(jobId, freelancer.getAddress());    
        await expect(marketplace.connect(client).revokeJobAssigned(jobId)).to.emit(marketplace, "JobRevoked").withArgs(jobId, client.getAddress());
    })

    it("requestJobReview", async function(){
        await assignJobAndExpectEvent(jobId)
        await expect(marketplace.connect(freelancer).acceptJob(jobId,{ value: freelancerStake })).to.emit(marketplace, "JobAccepted").withArgs(jobId, freelancer.getAddress());    
        const result = "live link: https://blog.vercel.com";
        await expect(marketplace.connect(freelancer).requestJobReview(jobId,result)).to.emit(marketplace, "JobReviewed").withArgs(jobId, client.getAddress() ,freelancer.getAddress(), result);
    })

        it("completeJob", async function(){
        await assignJobAndExpectEvent(jobId);
        await expect(marketplace.connect(freelancer).acceptJob(jobId,{ value: freelancerStake })).to.emit(marketplace, "JobAccepted").withArgs(jobId, freelancer.getAddress());
        await expect(marketplace.connect(client).completeJob(jobId, "Great Work!")).to.emit(marketplace, "JobCompleted").withArgs(jobId, client.getAddress());
    })

    it("payOnCompletion", async function() {
        await assignJobAndExpectEvent(jobId);
        await expect(marketplace.connect(freelancer).acceptJob(jobId,{ value: freelancerStake })).to.emit(marketplace, "JobAccepted").withArgs(jobId, freelancer.getAddress());
        await expect(marketplace.connect(client).completeJob(jobId, "Great Work!")).to.emit(marketplace, "JobCompleted").withArgs(jobId, client.getAddress());
        await expect(marketplace.connect(client).payOnCompletion(jobId)).to.emit(marketplace, "AmountPaidOnCompletion").withArgs(jobId, freelancer.getAddress(), total_budget - (BigInt(platformFeePer) * total_budget) / 100n + freelancerStake);
    })

    it("deadlinePassed" , async function(){
        await assignJobAndExpectEvent(jobId);
        await expect(marketplace.connect(freelancer).acceptJob(jobId,{ value: freelancerStake })).to.emit(marketplace, "JobAccepted").withArgs(jobId, freelancer.getAddress());
        // fast forward time to simulate deadline passed
        const jobData = await marketplace.getJobById(jobId);
        const deadline = BigInt((await jobData.deadline).toString());
        const block = await hre.ethers.provider.getBlock("latest");
        const currentTime = block?.timestamp;
        if (currentTime === undefined) {
            throw new Error("Could not fetch current block timestamp.");
        }
        const timeToFastForward = Number(deadline - BigInt(currentTime)) + 1; // add 1 second to ensure deadline is passed
        await hre.ethers.provider.send("evm_increaseTime", [timeToFastForward]);
        await hre.ethers.provider.send("evm_mine", []);
        await expect(marketplace.connect(client).deadlinePassed(jobId)).to.emit(marketplace, "JobNotCompleted").withArgs(jobId);
    })
    it("withdrawFundsByOwner", async function () {

        const total_platform_fee = await marketplace.totalPlatformFees(); 
        await expect(marketplace.connect(owner).withdrawPlatformFees()).to.emit(marketplace, "FundsWithdrawnByOwner").withArgs(owner.getAddress(), total_platform_fee);
    })
})

