import { ethers } from "hardhat";

async function main() {
  const VoiceMaskAlpha = await ethers.getContractFactory("VoiceMaskAlpha");
  console.log("Deploying...");
  const voiceMaskAlpha = await VoiceMaskAlpha.deploy();
  await voiceMaskAlpha.deployed();
  console.log("VoiceMaskAlpha deployed to:", voiceMaskAlpha.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
