// import { ethers } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";


async function main() {
    let owner: SignerWithAddress;
    let minter: SignerWithAddress;
    [owner, minter] = await ethers.getSigners();

    const deployAddress = "0xFe899437053430Bf679B321CcaCF329234468f89"//GOERLI
    const baseUri = "https://ipfs.io/ipfs/QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/";



    const VoiceMaskAlpha = await ethers.getContractFactory("VoiceMaskAlpha");
    const voiceMaskAlpha = VoiceMaskAlpha.attach(
        deployAddress
    );


    // //베이스 uri
    // await voiceMaskAlpha.connect(owner).setBaseURI(baseUri);
    // //민터 세팅
    // await voiceMaskAlpha.connect(owner).setMinter(minter.address);

    await voiceMaskAlpha.connect(minter).mintAuction();

}