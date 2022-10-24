// import { ethers } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";


async function main() {
    let owner: SignerWithAddress;
    [owner] = await ethers.getSigners();

    const deployAddress = "0x745a1ff081724550E75fF59B6E5C970262025Ded"//GOERLI
    const baseUri = "https://lovo.mypinata.cloud/ipfs/QmNrFaBxUsGnfiyhw81nsGcKfwnWKPS5iap87CgTWtMz1A/";

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
