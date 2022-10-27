import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";



describe.skip("Alpha + Auction", function () {
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;


  const baseUri = 'https://gateway.pinata.cloud/ipfs/Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr/';

  // before(async function () {
  // })

  describe("Success scenario", function () {
    before(async function () {
      [owner, user1, user2] = await ethers.getSigners();

      // NFT 디플로이
      const VoiceMaskAlpha = await ethers.getContractFactory("VoiceMaskAlpha");
      this.vmAlpha = await VoiceMaskAlpha.deploy();
      await this.vmAlpha.deployed();
      await this.vmAlpha.connect(owner).setBaseURI(baseUri);

    })
    it("Set mint number", async function () {
      await this.vmAlpha.connect(owner).setMaxSupply(7);
      await this.vmAlpha.connect(owner).setTeamSupply(5);
      

    });

    it("Should success mint", async function () {
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(user1.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);

      let id = await this.vmAlpha.tokensOfOwner(owner.address);
      console.log(id);

      let id2 = await this.vmAlpha.tokensOfOwner(user1.address);
      console.log(id2);

    });

    it("Should fail mint", async function () {
      await expect(this.vmAlpha.connect(user2).mintTeam(user2.address, 1)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it("Should fail mint", async function () {
      await this.vmAlpha.connect(owner).setMinter(user1.address);
      await expect(this.vmAlpha.connect(user1).mintTeam(user1.address, 1)).to.be.revertedWith('Ownable: caller is not the owner');
      await this.vmAlpha.connect(user1).mintAuction();
      let id2 = await this.vmAlpha.tokensOfOwner(user1.address);
      console.log(id2);
    });


    it("Should fail mint", async function () {
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await expect(this.vmAlpha.connect(owner).mintTeam(owner.address, 1)).to.be.revertedWith('Team supply all sold out');
    });

    it("Should fail mint", async function () {
      await this.vmAlpha.connect(user1).mintAuction();
      await expect(this.vmAlpha.connect(user1).mintAuction()).to.be.revertedWith('All sold out');

      // await expect(this.vmAlpha.connect(owner).mintTeam(owner.address, 1)).to.be.revertedWith('All sold out');
    });


  });



});