// import { ethers } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";


async function main() {
    let owner: SignerWithAddress;
    let minter: SignerWithAddress;
    [owner] = await ethers.getSigners();

    const deployAddress_Alpha = "0x6a19fff6906c68e84e12a03388c8e0794c380102"//GOERLI
    const VoiceMaskAlpha = await ethers.getContractFactory("VoiceMaskAlpha");
    const voiceMaskAlpha = VoiceMaskAlpha.attach(
      deployAddress_Alpha
    );

    const deployAddress_Auction = "0x54195c61528D4DC90Ae3dd943754ed3E63B60363"//GOERLI
    const VMAAuction = await ethers.getContractFactory("VMAAuction");
    const vMAAuction = VMAAuction.attach(
      deployAddress_Auction
    );

    //민터 세팅
    await voiceMaskAlpha.connect(owner).setMinter('0x54195c61528D4DC90Ae3dd943754ed3E63B60363');

    //옥션 시작
    await vMAAuction.connect(owner).unpause();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
