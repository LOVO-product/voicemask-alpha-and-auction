// import { ethers } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";


async function main() {
    let owner: SignerWithAddress;
    let minter: SignerWithAddress;
    [owner, minter] = await ethers.getSigners();

    const deployAddress = "0x48Fb09817Ee2D47b997392829D45DAaE78c3e9FB"//GOERLI
    const baseUri = "https://ipfs.io/ipfs/QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/";

    const VoiceMaskAlpha = await ethers.getContractFactory("VoiceMaskAlpha");
    const voiceMaskAlpha = VoiceMaskAlpha.attach(
        deployAddress
    );

    //베이스 uri 세팅
    await voiceMaskAlpha.connect(owner).setBaseURI(baseUri);
    //민터 세팅
    await voiceMaskAlpha.connect(owner).setMinter(minter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });