import { ethers } from "hardhat";

async function main() {
  const Alpha_addr = "0x6a19fff6906c68e84e12a03388c8e0794c380102"; //TODO

  const VMAAuction = await ethers.getContractFactory("VMAAuction");
  console.log("Deploying...");
  const vMAAuction = await VMAAuction.deploy(Alpha_addr, 60*2, 1, 60*5, 2);
  await vMAAuction.deployed();
  console.log("VMAAuction deployed to:", vMAAuction.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
