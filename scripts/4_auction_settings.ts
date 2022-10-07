// import { ethers } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";


async function main() {
    let owner: SignerWithAddress;
    let minter: SignerWithAddress;
    [owner] = await ethers.getSigners();

    const deployAddress_Alpha = "0xDb7AD04e69c88a42A084461656E69b8bb1FA8276"//GOERLI
    const VoiceMaskAlpha = await ethers.getContractFactory("VoiceMaskAlpha");
    const voiceMaskAlpha = VoiceMaskAlpha.attach(
      deployAddress_Alpha
    );

    const deployAddress_Auction = "0x97F758686A68c01a3a612625F8Da79AEe33D5929"//GOERLI
    const VMAAuction = await ethers.getContractFactory("VMAAuction");
    const vMAAuction = VMAAuction.attach(
      deployAddress_Auction
    );

    //민터 세팅
    await voiceMaskAlpha.connect(owner).setMinter(deployAddress_Auction);

    //옥션 시작
    await vMAAuction.connect(owner).unpause();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
