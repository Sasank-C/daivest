const { ethers } = require("hardhat");


async function main() {
  console.log("Deploying contracts with the account:", await ethers.provider.getSigner().getAddress());
  const accounts = await ethers.getSigners();
  console.log("Account balance:", (await accounts[0].getBalance()).toString());
  const DaiMock = await ethers.getContractFactory("DaiMock");
  const Vault = await ethers.getContractFactory("Vault");
  const dai = await DaiMock.deploy("Mock Dai", "DAI", 18);
  await dai.deployed();
  console.log(`DAI deployed to ${dai.address}`);
  const vault = await Vault.deploy(dai.address, "DAI Token Vault", "vwTKN");
  await vault.deployed();
  console.log(`Vault  deployed to ${vault.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
