import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
const hre = require("hardhat");


describe("Alpha + Auction", function () {
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  const baseUri = 'https://gateway.pinata.cloud/ipfs/Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr/';

  // before(async function () {
  // })

  describe("Success scenario", function () {
    before(async function () {
      [owner, user1, user2, user3] = await ethers.getSigners();

      // NFT 디플로이
      const VoiceMaskAlpha = await ethers.getContractFactory("VoiceMaskAlpha");
      this.vmAlpha = await VoiceMaskAlpha.deploy();
      await this.vmAlpha.deployed();
      await this.vmAlpha.connect(owner).setBaseURI(baseUri);

    })
    it("Set mint number", async function () {
      await this.vmAlpha.connect(owner).setAuctionSupply(3);
      await this.vmAlpha.connect(owner).setTeamSupply(5);
    });

    it("Should limit minting number", async function () {
      await this.vmAlpha.connect(owner).setMinter(user1.address);

      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(user3.address, 1);
      // await expect(this.vmAlpha.connect(owner).mintTeam(owner.address, 1)).to.be.revertedWith('Team supply all sold out');

      const addr = await this.vmAlpha.ownerOf(2);
      console.log(addr);

      await this.vmAlpha.connect(user1).mintAuction();
      await this.vmAlpha.connect(user1).mintAuction();
      await this.vmAlpha.connect(user1).mintAuction();
      await expect(this.vmAlpha.connect(user1).mintAuction()).to.be.revertedWith('Auction supply all sold out');

    });

    

    it.skip("two", async function () {
      //nft가 하나도 없을 때
      let res = await this.vmAlpha.connect(owner)._checkIfLockedOwner(user2.address);
      expect(res).equals(false);

      //옥션 nft만 있을 때
      res = await this.vmAlpha.connect(owner)._checkIfLockedOwner(user1.address);
      expect(res).equals(false);

      //인플루언서 nft가 있고 n일이 지나지 않았을 때
      res = await this.vmAlpha.connect(owner)._checkIfLockedOwner(user3.address);
      expect(res).equals(true);

      //인플루언서 nft가 있고 15블락이 지났을 때
      let bday = await this.vmAlpha.connect(owner).getBirthday(3);
      await ethers.provider.send("evm_mine", [bday.toNumber()+ (60*60*24*91/12)+ 1]);
  
      res = await this.vmAlpha.connect(owner)._checkIfLockedOwner(user3.address);
      expect(res).equals(false);
    });


    it.skip("timecheck", async function () {


      //인플루언서 nft가 있고 n일이 지나지 않았을 때
      let res = await this.vmAlpha.connect(owner)._checkIfLockedtoken(0);
      expect(res).equals(true);

      //인플루언서 nft가 있고 많은 블락이 지났을 때
      // let bday = await this.vmAlpha.connect(owner).getBirthday(0);
      await hre.network.provider.send("hardhat_mine", ["0x9ff61"]);
      // await ethers.provider.send("evm_mine", [855200]);
  
      res = await this.vmAlpha.connect(owner)._checkIfLockedtoken(0);
      expect(res).equals(false);
    });

    it("transfer", async function () {


      //인플루언서 nft가 있고 n일이 지나지 않았을 때
      // await expect(this.vmAlpha.connect(user1).transferFrom(owner.address, user1.address, 0)).to.be.revertedWith('Token is locked up yet');
      // await hre.network.provider.send("hardhat_mine", ["0x9ff61"]);
      // this.vmAlpha.connect(user1).transferFrom(owner.address, user1.address, 0);

     
    });
   


  });



});