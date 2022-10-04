// import { ethers } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";


async function main() {
    let owner: SignerWithAddress;
    [owner] = await ethers.getSigners();

    const deployAddress = "0x6A19Fff6906C68E84e12a03388c8E0794c380102"//GOERLI
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
