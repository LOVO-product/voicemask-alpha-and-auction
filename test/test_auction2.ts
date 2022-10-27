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
      await this.vMAAuction.connect(owner).unpause();
      let res = await this.vMAAuction.connect(owner).auction();
      console.log("Current auction alpha id: ", res.alphaId);
      expect(await this.vmAlpha.ownerOf(res.alphaId)).equals(this.vMAAuction.address);


      await this.vMAAuction.connect(user1).createBid(999, { value: ethers.utils.parseEther('0.1') });
      const balance1 = await ethers.provider.getBalance(user2.address);
      let auction = await this.vMAAuction.auction();

      // //bid one
      // await this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('0.1') });
      // const balance1 = await ethers.provider.getBalance(user2.address);
      // let auction = await this.vMAAuction.auction();
      // console.log("1"+auction);
      // //bid two
      // await this.vMAAuction.connect(user2).createBid(res.alphaId, { value: ethers.utils.parseEther('3') });
      // const balance2 = await ethers.provider.getBalance(user2.address);
      // auction = await this.vMAAuction.auction();
      // console.log("2"+auction);
      // //bid 3
      // await this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('3.5') });
      // let auction3 = await this.vMAAuction.auction();
      // console.log("3"+auction3);

      //createBid   ·       64938  ·      87094 
      // console.log(ethers.utils.formatEther( balance1 ));
      // console.log(ethers.utils.formatEther( balance2 ));

    });


  });

});