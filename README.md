# Token Vesting DApp

This project consists of a decentralized application (DApp) for managing token vesting for various stakeholders in a web3 organization. It features an Ethereum smart contract backend written in Solidity and a React frontend with Tailwind CSS, powered by Vite.

## Description

The smart contract backend includes two main contracts:
1. **CustomToken**: A simple ERC20 token contract.
2. **TokenVestingVII**: A contract that manages token vesting schedules for different stakeholder categories like Community, Validators, Investors, etc.

The frontend is a React application using Tailwind CSS for styling, and Vite as the build tool. It allows organizations to register, create vesting schedules, whitelist addresses, and enables stakeholders to claim their vested tokens.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (LTS version)
- Yarn or npm
- MetaMask or a similar Ethereum wallet browser extension

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Lukman-01/Token_Vesting_Schedule.git
   cd Token_Vesting_Schedule
   ```

2. **Install dependencies for the smart contract:**

   ```bash
   cd smart_contract
   npm install
   ```

3. **Deploy the smart contract:**
   
   - Update the deployment scripts with your Ethereum network details.
   - Deploy using Hardhat.

4. **Install dependencies for the frontend:**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure the frontend:**

   - Set up the `.env` file with the smart contract addresses and any other necessary configurations.

6. **Run the frontend application:**

   ```bash
   npm run dev
   ```

   The application should now be running on `http://localhost:5173` (or another port if specified).

### Executing the DApp

1. **Organization Registration:**
   
   - Use the frontend interface to register an organization and create an ERC20 token.

2. **Setting Vesting Schedules:**
   
   - Specify the stakeholder type and their vesting period.

3. **Whitelisting Addresses:**
   
   - Whitelist addresses for different stakeholders.

4. **Claiming Tokens:**
   
   - Whitelisted addresses can claim their tokens after the vesting period via the frontend interface.

## Authors

Blockchain Enthusiasts: Abdulyekeen Lukman
[https://www.linkedin.com/in/lukman-abdulyekeen-75746323a/]

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.