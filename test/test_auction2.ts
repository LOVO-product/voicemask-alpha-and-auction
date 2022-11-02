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

      //옥션 디플로이
      const VMAAuction = await ethers.getContractFactory("VMAAuction");
      this.vMAAuction = await VMAAuction.deploy(this.vmAlpha.address, 60*2, 1, 60*5, 2); //nft 주소, 2분패딩, 1 wei, 5분진행,비드증감율  
      await this.vMAAuction.deployed();

      //옥션 컨트랙트 주소를 민터로지정
      await this.vmAlpha.connect(owner).setMinter(this.vMAAuction.address);


    })

    it("Set mint number", async function () {
      await this.vmAlpha.connect(owner).setTeamSupply(5);
      await this.vmAlpha.connect(owner).setAuctionSupply(3);
    });

    it("mint one", async function () {
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(user1.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(user1.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(user1.address, 1);

    });

    it("Should success 1st auction", async function () {
      await this.vMAAuction.connect(owner).unpause();
      let res = await this.vMAAuction.connect(owner).auction();
      console.log("Current auction alpha id: ", res.alphaId);
      expect(await this.vmAlpha.ownerOf(res.alphaId)).equals(this.vMAAuction.address);


      //bid one
      await this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('0.1') });
      
      //bid two
      await this.vMAAuction.connect(user2).createBid(res.alphaId, { value: ethers.utils.parseEther('3') });
      const balance2 = await ethers.provider.getBalance(user2.address);
      let auction = await this.vMAAuction.auction();
      console.log("2"+auction);
      //bid 3
      await this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('3.5') });
      let auction3 = await this.vMAAuction.auction();
      console.log("3"+auction3);
    });

    it("finish the auction- time flies", async function () {
      await ethers.provider.send("evm_increaseTime", [301]);
    });


    it("Start 2nd auction", async function () {
      await this.vMAAuction.connect(owner).settleCurrentAndCreateNewAuction();
      let res = await this.vMAAuction.connect(owner).auction();
    });


    it("Can the winner send the nft", async function () {
      expect(await this.vmAlpha.connect(owner).ownerOf(6)).equals(user1.address);
      await this.vmAlpha.connect(user1).transferFrom(user1.address, user2.address, 6);
      expect(await this.vmAlpha.connect(owner).ownerOf(6)).equals(user2.address);
    });

    it("Is team nft still locked up", async function () {
      //오너가 남한테 보내는건됨
      await this.vmAlpha.connect(owner).transferFrom(owner.address, user2.address, 1);
      expect(await this.vmAlpha.connect(owner).ownerOf(1)).equals(user2.address);

      //유저2가 유저3한테는 보낼수 없어야함
      await expect(this.vmAlpha.connect(user2).transferFrom(user2.address, user3.address, 1)).to.be.revertedWith('Token is locked up yet');

      //유저2가 오너한테는 보낼수 있어야함
      await this.vmAlpha.connect(user2).transferFrom(user2.address, owner.address, 1);
      expect(await this.vmAlpha.connect(owner).ownerOf(1)).equals(owner.address);

    });

    it("time flies", async function () {
      await ethers.provider.send("evm_increaseTime", [301]);
    });

    it("Start 3rd auction", async function () {
      await this.vMAAuction.connect(owner).settleCurrentAndCreateNewAuction();
      let res = await this.vMAAuction.connect(owner).auction();
      await this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('0.1') });
      // res = await this.vMAAuction.connect(owner).auction();
      // console.log(res);

    });

    it("time flies", async function () {
      await ethers.provider.send("evm_increaseTime", [601]);      
    });

    // it("Start 4th auction", async function () {
    //   await this.vMAAuction.connect(owner).pause();
    //   await this.vMAAuction.connect(owner).settleAuction();

    //   let res = await this.vMAAuction.connect(owner).auction();
    //   console.log(res);
    //   //재시작안되는것 확인
    //   await this.vMAAuction.connect(owner).unpause();
    //   res = await this.vMAAuction.connect(owner).auction();
    //   console.log(res);
    // });

    it("Start 4th auction2", async function () {
      //settle 하고 pause 상태로 변경함
      await this.vMAAuction.connect(owner).settleCurrentAndCreateNewAuction(); //pause(); 와 같은역할함

      let res = await this.vMAAuction.connect(owner).auction();
      console.log(res);

      //revert는 두번째부터 됨
      await expect(this.vMAAuction.connect(owner).settleCurrentAndCreateNewAuction()).to.be.revertedWith('Pausable: paused');

    });


  });

});