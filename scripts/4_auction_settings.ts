// import { ethers } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";


async function main() {
    let owner: SignerWithAddress;
    let minter: SignerWithAddress;
    [owner] = await ethers.getSigners();

    const deployAddress_Alpha = "0xca840FE0574A1D1BfB1C34c740060fD70A3d4Af6"//GOERLI
    const VoiceMaskAlpha = await ethers.getContractFactory("VoiceMaskAlpha");
    const voiceMaskAlpha = VoiceMaskAlpha.attach(
      deployAddress_Alpha
    );

    const deployAddress_Auction = "0x5F42083167B91E3346F9acb1a62fC6A17735b260"//GOERLI
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
