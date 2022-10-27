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

      //옥션 디플로이
      const VMAAuction = await ethers.getContractFactory("VMAAuction");
      this.vMAAuction = await VMAAuction.deploy(this.vmAlpha.address, 60*2, 1, 60*5, 2); //nft 주소, 2분패딩, 1 wei, 5분진행,비드증감율  
      await this.vMAAuction.deployed();

      //옥션 컨트랙트 주소를 민터로지정
      await this.vmAlpha.connect(owner).setMinter(this.vMAAuction.address);


    })

    it("Should success mint", async function () {
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(user1.address, 1);

      let id = await this.vmAlpha.tokensOfOwner(owner.address);
      console.log(id);
      // await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);

      const uri = await this.vmAlpha.tokenURI(0);
      console.log(uri);

      await this.vmAlpha.connect(owner).burn(0);
      await this.vmAlpha.tokensOfOwner(owner.address);

    });

    it("Should success auction", async function () {
      await this.vMAAuction.connect(owner).unpause();
      let res = await this.vMAAuction.connect(owner).auction();
      console.log("Current auction alpha id: ", res.alphaId);
      expect(await this.vmAlpha.ownerOf(res.alphaId)).equals(this.vMAAuction.address);

      //bid one
      await this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('0.1') });
      const balance1 = await ethers.provider.getBalance(user2.address);
      //bid two
      await this.vMAAuction.connect(user2).createBid(res.alphaId, { value: ethers.utils.parseEther('5') });
      const balance2 = await ethers.provider.getBalance(user2.address);

      console.log(ethers.utils.formatEther( balance1 ));
      console.log(ethers.utils.formatEther( balance2 ));

      // end the first bidding
      await ethers.provider.send("evm_increaseTime", [301]);
      
      let auction = await this.vMAAuction.auction();
      console.log(auction);

    });

    it("Should success 2nd auction", async function () {
      const balance_owner_before = await ethers.provider.getBalance(owner.address);
      console.log(ethers.utils.formatEther( balance_owner_before ));

      await this.vMAAuction.connect(owner).settleCurrentAndCreateNewAuction();
      let res = await this.vMAAuction.connect(owner).auction();

      const balance_owner = await ethers.provider.getBalance(owner.address);
      console.log(ethers.utils.formatEther( balance_owner ));


      expect(await this.vmAlpha.ownerOf(res.alphaId-1)).equals(user2.address);



      console.log("Current auction alpha id: ", res.alphaId);
      await this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('1') });

      await this.vMAAuction.connect(owner).pause();
      // await this.vMAAuction.connect(owner).unpause();
      await ethers.provider.send("evm_increaseTime", [301]);
      await this.vMAAuction.connect(owner).settleAuction();

      // await this.vMAAuction.connect(user2).createBid(res.alphaId, { value: ethers.utils.parseEther('2') });



    });

    it("Should success 3rd auction", async function () {
      await this.vMAAuction.connect(owner).unpause();

      let res = await this.vMAAuction.connect(owner).auction();
      //res.alphaId
      await ethers.provider.send("evm_increaseTime", [301]);


      await this.vMAAuction.connect(owner).settleCurrentAndCreateNewAuction();

      expect(await this.vmAlpha.ownerOf(res.alphaId)).equals(owner.address);

    });


  });


  describe("Failure scenario", function () {
    before(async function () {
      [owner, user1, user2] = await ethers.getSigners();


      // NFT 디플로이
      const VoiceMaskAlpha = await ethers.getContractFactory("VoiceMaskAlpha");
      this.vmAlpha = await VoiceMaskAlpha.deploy();
      await this.vmAlpha.deployed();
      await this.vmAlpha.connect(owner).setBaseURI(baseUri);

      //옥션 디플로이
      const VMAAuction = await ethers.getContractFactory("VMAAuction");
      this.vMAAuction = await VMAAuction.deploy(this.vmAlpha.address, 120, 1, 300, 2);
      await this.vMAAuction.deployed();

      //옥션 컨트랙트 주소를 민터로지정
      await this.vmAlpha.connect(owner).setMinter(this.vMAAuction.address);

    })
    it("should fail - ownable, teammint", async function () {
      await expect(this.vmAlpha.connect(user2).mintTeam(user2.address, 1)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it("should fail - mintAuction", async function () {
      await expect(this.vmAlpha.connect(user2).mintAuction()).to.be.revertedWith('Sender is not the minter');
    });

    it("should fail - Pausable: paused", async function () {
      await expect(this.vMAAuction.connect(user1).createBid(0, { value: ethers.utils.parseEther('1') })).to.be.revertedWith('Pausable: paused');
    });

    it("should fail - createBid 4 reasons", async function () {
      await this.vMAAuction.connect(owner).unpause();
      let res = await this.vMAAuction.connect(owner).auction();
      await expect(this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('0') })).to.be.revertedWith('Send at least reservePrice');
      await this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('0.1') });
      await expect(this.vMAAuction.connect(user1).createBid(100, { value: ethers.utils.parseEther('0.1') })).to.be.revertedWith('Not for this auction');
      await expect(this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('0.1') })).to.be.revertedWith('Increase the bid by minBidIncrementPercentage');
      await ethers.provider.send("evm_increaseTime", [301]);
      await expect(this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('1') })).to.be.revertedWith('Auction is expired');


    });

    it("should fail - settleAuction 3 reasons", async function () {
      await this.vMAAuction.connect(owner).settleCurrentAndCreateNewAuction(); 
      
      await expect(this.vMAAuction.connect(owner).settleAuction()).to.be.revertedWith('Pausable: not paused');

      await this.vMAAuction.connect(owner).pause();

      await expect(this.vMAAuction.connect(owner).settleAuction()).to.be.revertedWith('Auction is active');
      await ethers.provider.send("evm_increaseTime", [301]);
      await this.vMAAuction.connect(owner).settleAuction();
      await expect(this.vMAAuction.connect(owner).settleAuction()).to.be.revertedWith('Auction is settled already');

    });
  
  });

});