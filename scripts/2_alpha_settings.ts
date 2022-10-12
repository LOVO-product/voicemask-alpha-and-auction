// import { ethers } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";


async function main() {
    let owner: SignerWithAddress;
    [owner] = await ethers.getSigners();

    const deployAddress = "0xca840FE0574A1D1BfB1C34c740060fD70A3d4Af6"//GOERLI
    const baseUri = "https://ipfs.io/ipfs/QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/";

    const VoiceMaskAlpha = await ethers.getContractFactory("VoiceMaskAlpha");
    const voiceMaskAlpha = VoiceMaskAlpha.attach(
        deployAddress
    );

    //베이스 uri 세팅
    await voiceMaskAlpha.connect(owner).setBaseURI(baseUri);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
