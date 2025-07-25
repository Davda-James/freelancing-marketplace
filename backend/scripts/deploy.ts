import { ethers } from "hardhat";

async function main() {
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(100000, 20, 20, 10, 5);

  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", await marketplace.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
