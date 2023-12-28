// Import ethers from Hardhat package
const { ethers } = require("hardhat");

async function main() {
  // Deploy CustomToken
  const CustomToken = await ethers.getContractFactory("CustomToken");
  const customToken = await CustomToken.deploy("VestingToken", "VST", 1000000);
  await customToken.deployed();
  console.log("CustomToken deployed to:", customToken.address);

  // Deploy TokenVesting
  const TokenVesting = await ethers.getContractFactory("TokenVesting");
  const tokenVesting = await TokenVesting.deploy(customToken.address);
  await tokenVesting.deployed();
  console.log("TokenVesting deployed to:", tokenVesting.address);

  // Deploy TokenVestingVII
  const TokenVestingVII = await ethers.getContractFactory("TokenVestingVII");
  const tokenVestingVII = await TokenVestingVII.deploy(customToken.address);
  await tokenVestingVII.deployed();
  console.log("TokenVestingVII deployed to:", tokenVestingVII.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
