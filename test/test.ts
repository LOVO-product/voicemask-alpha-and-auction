import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";



describe("Alpha + Auction", function () {
  let owner: SignerWithAddress;
  let minter: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;


  const baseUri = 'https://gateway.pinata.cloud/ipfs/Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr/';

  before(async function () {
    [owner, minter, user1, user2] = await ethers.getSigners();


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

  describe("Success scenario", function () {
    it("Should success mint", async function () {
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);
      await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);

      let id = await this.vmAlpha.tokensOfOwner(owner.address);
      console.log(id);
      // await this.vmAlpha.connect(owner).mintTeam(owner.address, 1);

      const uri = await this.vmAlpha.tokenURI(0);
      console.log(uri);

      await this.vmAlpha.connect(owner).burn(0);
      id = await this.vmAlpha.tokensOfOwner(owner.address);
      console.log(id);

    });

    it("Should success auction", async function () {
      await this.vMAAuction.connect(owner).unpause();
      let res = await this.vMAAuction.connect(owner).auction();

      //bid one
      await this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('0.1') });
      //bid two
      await this.vMAAuction.connect(user2).createBid(res.alphaId, { value: ethers.utils.parseEther('0.3') });

      // end the first bidding
      await ethers.provider.send("evm_increaseTime", [301]);

    });

    it("Should success 2nd auction", async function () {
      await this.vMAAuction.connect(owner).settleCurrentAndCreateNewAuction();
      let res = await this.vMAAuction.connect(owner).auction();
      await this.vMAAuction.connect(user1).createBid(res.alphaId, { value: ethers.utils.parseEther('0.1') });


    });

  });

});