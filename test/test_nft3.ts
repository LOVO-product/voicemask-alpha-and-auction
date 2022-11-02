import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
const hre = require("hardhat");


describe.skip("Alpha", function () {
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
      await this.vmAlpha.connect(owner).setTeamSupply(4);

      await this.vmAlpha.connect(owner).setMinter(owner.address);

    });

    it("mint one", async function () {
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(user1.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(user1.address, 1);

    });

    it("timecheck", async function () {
      //오너는 락업 예외
      await this.vmAlpha.connect(owner).transferFrom(owner.address, user2.address, 1);
      expect(await this.vmAlpha.connect(user1).ownerOf(1)).equals(user2.address);

      //오너는 락업 예외2
      await this.vmAlpha['safeTransferFrom(address,address,uint256)'](
        owner.address,
        user2.address,
        2 // token id
      ); // syntax is as such due to overloaded function
      expect(await this.vmAlpha.connect(user1).ownerOf(2)).equals(user2.address);

      //오너에게 보내는것도 락업 예외3
      await expect(this.vmAlpha.connect(user1).transferFrom(user1.address, user2.address, 4)).to.be.revertedWith('Token is locked up yet');
      await this.vmAlpha.connect(user1).transferFrom(user1.address, owner.address, 4);
      expect(await this.vmAlpha.connect(owner).ownerOf(4)).equals(owner.address);


      //일반적으로는 락업되어야함
      await expect(this.vmAlpha.connect(user1).transferFrom(user1.address, user2.address, 3)).to.be.revertedWith('Token is locked up yet');

      //많은 블락이 지났을 때
      await hre.network.provider.send("hardhat_mine", ["0x9ff61"]);
      // // await ethers.provider.send("evm_mine", [855200]);

      // 락업이 해제되어 거래 가능하다
      await this.vmAlpha.connect(user1).transferFrom(user1.address, user2.address, 3);

    });

    // it("transfer", async function () {

    //   //인플루언서 nft가 있고 n일이 지나지 않았을 때
    //   // await expect(this.vmAlpha.connect(user1).transferFrom(owner.address, user1.address, 0)).to.be.revertedWith('Token is locked up yet');
    //   // await hre.network.provider.send("hardhat_mine", ["0x9ff61"]);
    //   // this.vmAlpha.connect(user1).transferFrom(owner.address, user1.address, 1);


    // });



  });



});