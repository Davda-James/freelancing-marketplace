<div align="center">

# 🚀 FreelanceHub
### *Decentralized Web3 Marketplace*

![Banner](./frontend/public/freelance-logo.png)

<img alt="FreelanceHub" src="https://img.shields.io/badge/🚀_FreelanceHub-Web3_Marketplace-6366f1?style=for-the-badge&logoColor=white" width="300">

<br/>

<img alt="Freelance Markfetplace" src="https://img.shields.io/badge/Freelance-Marketplace-blue?style=for-the-badge&logo=ethereum">
<img alt="Status" src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge">

**A decentralized freelance marketplace built on Ethereum blockchain**

*Connecting freelancers and clients in a trustless, transparent environment*

---

<!-- 🌐 **[Live Demo](https://freelancehub-demo.com)** • 📖 **[Documentation](https://docs.freelancehub.com)** • 🐛 **[Report Bug](https://github.com/freelancehub/issues)** -->

</div>

## ✨ Features

<div align="center">

| 🔐 **Blockchain Powered** | 💰 **Secure Payments** | 🎯 **Smart Contracts** | 🌟 **Rating System** |
|:-------------------------:|:----------------------:|:----------------------:|:--------------------:|
| Built on Ethereum | Escrow functionality | Automated workflows | Transparent reviews |

</div>

### 🎯 Core Features

- **🔗 Blockchain Integration**: Ethereum-based smart contracts for secure transactions
- **💼 Job Management**: Post, browse, and manage freelance jobs
- **⭐ Rating & Reviews**: Transparent feedback system for both clients and freelancers
- **💰 Escrow System**: Secure payment holding until job completion
- **📊 Analytics Dashboard**: Track earnings, jobs, and performance metrics
- **🔍 Portfolio Search**: Discover freelancers by their Ethereum address
- **🎨 Modern UI/UX**: Beautiful, responsive design with dark theme

## 🛠️ Tech Stack

<div align="center">

### Frontend
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

### Blockchain
[![Ethereum](https://img.shields.io/badge/Ethereum-Mainnet-627EEA?style=flat-square&logo=ethereum)](https://ethereum.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-363636?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-6.x-2535A0?style=flat-square&logo=ethereum)](https://ethers.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-Framework-FFF100?style=flat-square&logo=hardhat)](https://hardhat.org/)

### Tools & Libraries
[![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-000000?style=flat-square&logo=lucide)](https://lucide.dev/)
[![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245?style=flat-square&logo=react-router)](https://reactrouter.com/)

</div>

## 📸 Screenshots

<div align="center">

### Dashboard Overview
*Track your earnings, active jobs, and performance metrics*

![Dashboard](./frontend/public/dashboard.jpg)

### Find Freelancers
*Search for freelancers by their Ethereum address*

![Find Freelancers](./frontend/public/find-freelancers.jpg)

### Freelancer Portfolio
*View freelancer profiles, ratings, and work history*

![Freelancer Portfolio](./frontend/public/freelancer-portfolio.jpg)

### Job Marketplace
*Browse and post freelance opportunities*

![Marketplace](./frontend/public/marketplace.jpg)

### Job Detail
*View job details, apply, and manage proposals*

![Job Detail](./frontend/public/job-detail.jpg)

### Freelancer Apply
*Submit your application and confirm your interest*

![Freelance-Apply](./frontend/public/freelance-apply.jpg)

### Freelancer Portfolio
*Showcase your work and build reputation*

![Freelancer Portfolio](./frontend/public/freelancer-portfolio.jpg)

### Post Job
*Create new job listings with clear requirements*

![Post Job](./frontend/public/post-job.jpg)

### Freelancer Applications
*Review freelancer applications and proposals*

![Freelancer Applications](./frontend/public/freelancers-applications.jpg)

### Assign Freelancer
*Assign a freelancer to a job from their application*

![Assign Freelancer](./frontend/public/assign-freelancer-from-application.jpg)

### Accept Offer
*Accept proposal*

![Accept Offer](./frontend/public/accept-offer.jpg)

### Submit Proof Of Completion
*Submit proof of work completion for job submission review*

![Submit Proof Of Completion](./frontend/public/submit-proof-of-completion.jpg)

### Upload Proof Of Completion to IPFS
*Upload proof of work to IPFS for secure storage*

![Upload Proof Of Completion to IPFS](./frontend/public/submit-proof-of-completion.jpg)

### Hash we got to IPFS submission
*View the IPFS hash of the submitted proof of completion*

![IPFS Hash](./frontend/public/ipfs-hash.jpg)

### Progress Timeline and Submission
*Track job progress and submission status*

![Progress Timeline](./frontend/public/timeline-and-submission.jpg)

### Rate Freelancer
*Rate the freelancer based on their performance*

![Rate Freelancer](./frontend/public/rate-freelancer.jpg)   

### See Reviews
*View freelancer reviews and feedback*

![See Reviews](./frontend/public/see-reviews.jpg)

</div>


## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or later) - [Download](https://nodejs.org/)
- **npm** or **vite** - Package manager
- **Git** - Version control
- **MetaMask** - Browser wallet extension

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/freelance-marketplace.git
   cd freelance-marketplace
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install blockchain dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   # Frontend environment
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
    VITE_CLERK_PUBLISHABLE_KEY=
    VITE_LOCAL_IPFS_GATEWAY=http://localhost:8080/ipfs
    VITE_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs
    VITE_IPFS_API_URL=http://localhost:5001/api/v0
   ```

    # Blockchain environment
    ```bash
        cd backend
        cp .env.example .env
    ```
    ```bash
        PUBLIC_KEY=
        PRIVATE_KEY=
        RPC_URL=
        CHAIN_ID=
        CONTRACT_ADDRESS=
        OWNER=
    ```
4. **Deploy Smart Contracts (Local)**
   ```bash
   cd blockchain
   
   # Start local blockchain
   npx hardhat node
   
   # Deploy contracts (new terminal)
   npx hardhat run scripts/deploy.js --network localhost
   ```
5. **Setting up the IPFS** 
    *Using docker easy to setup and use*
    ```bash
    docker run -d --name ipfs_host -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/kubo:master-latest
    ```
5. **Start the application**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🎮 Usage Guide

### For Freelancers 👨‍💻

1. **🔗 Connect Wallet**: Connect your MetaMask wallet
2. **🔍 Browse Jobs**: Explore available opportunities in the marketplace
3. **📝 Apply for Jobs**: Submit proposals with your rates and timeline
4. **✅ Complete Work**: Deliver quality work and get paid automatically
5. **⭐ Build Portfolio**: Accumulate ratings and build your reputation

### For Clients 👔

1. **📄 Post Jobs**: Create detailed job listings with clear requirements
2. **👀 Review Proposals**: Evaluate freelancer applications
3. **🤝 Hire Freelancers**: Select the best candidate for your project
4. **💰 Release Payment**: Approve work and release escrowed funds
5. **📝 Leave Reviews**: Rate freelancers based on their performance


### Core Contracts

```solidity
📁 contracts/
├── 📄 Marketplace.sol    # Main contract handling job lifecycle
```

<div align="center">

| Metric | Description | Icon |
|--------|-------------|------|
| **Jobs as Freelancer** | Track jobs you've completed as a service provider | 💼 |
| **Jobs Posted** | Monitor job listings you've created as a client | 📝 |
| **Active Jobs** | View currently ongoing projects | ⏰ |
| **Total Earned** | ETH earned from completed freelance work | 💰 |
| **Total Spent** | ETH spent on hiring freelancers | 💸 |
| **Average Rating** | Your reputation score from client feedback | ⭐ |
| **Success Rate** | Percentage of successfully completed jobs | 📈 |

</div>

## 📊 Project Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/freelancehub/freelance-marketplace?style=social)
![GitHub forks](https://img.shields.io/github/forks/freelancehub/freelance-marketplace?style=social)
![GitHub issues](https://img.shields.io/github/issues/freelancehub/freelance-marketplace)
![GitHub pull requests](https://img.shields.io/github/issues-pr/freelancehub/freelance-marketplace)

</div>

## 🙏 Acknowledgments

- [Ethereum Foundation](https://ethereum.org/) for blockchain infrastructure
- [React Team](https://react.dev/) for the amazing frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for beautiful icons
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Hardhat](https://hardhat.org/) for Ethereum development environment

</div>
---

<div align="center">

**Made with ❤️**

*Empowering the future of work through blockchain technology*

⭐ **Star me on GitHub** — it motivates me to keep improving!

[🔝 Back to top](#-freelancehub)

</div>