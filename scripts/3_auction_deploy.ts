import { ethers } from "hardhat";

async function main() {
  const Alpha_addr = "0xDb7AD04e69c88a42A084461656E69b8bb1FA8276"; //TODO

  const VMAAuction = await ethers.getContractFactory("VMAAuction");
  console.log("Deploying...");
  const vMAAuction = await VMAAuction.deploy(Alpha_addr, 60*5, 1, 60*60*12, 2);
  await vMAAuction.deployed();
  console.log("VMAAuction deployed to:", vMAAuction.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
