import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";



describe("ERC721A", function () {
  const quantity = 5000;
  let owner: SignerWithAddress;
  let minter: SignerWithAddress;
  const baseUri = 'https://gateway.pinata.cloud/ipfs/Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr/';

  beforeEach(async function () {
    [owner, minter] = await ethers.getSigners();

    const VoiceMaskAlpha = await ethers.getContractFactory("VoiceMaskAlpha");
    this.vmAlpha = await VoiceMaskAlpha.deploy();
    await this.vmAlpha.deployed();

    await this.vmAlpha.connect(owner).setBaseURI(baseUri);
    await this.vmAlpha.connect(owner).setMinter(minter.address);

  })

  describe("Success scenario", function () {
    it("Should success mint", async function () {
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      // const id = await this.vmAlpha.tokenOfOwnerByIndex(owner.address, 0);
      const id = await this.vmAlpha.tokensOfOwner(owner.address);
      
      console.log(id);
      // await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      
      const uri = await this.vmAlpha.tokenURI(0);
      console.log(uri);

      await this.vmAlpha.connect(minter).mintAuction();
      await this.vmAlpha.connect(minter).mintAuction();
      await this.vmAlpha.connect(minter).mintAuction();


    });

  });

});