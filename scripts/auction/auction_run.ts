import { ethers } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config()

let PRIVATE_KEY = process.env.PRIVATE_KEY as string;
let PRIVATE_KEY2 = process.env.PRIVATE_KEY2 as string;

const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", "QSuGf9zqKJy_SxE6yKOwA1mMjzSw0m8B");
let walletWithProvider = new ethers.Wallet(PRIVATE_KEY2, alchemyProvider);

const CONTRACT_ADDRESS = "0x97F758686A68c01a3a612625F8Da79AEe33D5929";

let abi = [
    "function auction() view external returns(uint256 alphaId, uint256 price, uint256 startTime, uint256 endTime, address payable bidder,bool settled)",
    "function settleCurrentAndCreateNewAuction() external",
    "function createBid(uint256 alphaId) external payable"
];

const vMAAuction_contract = new ethers.Contract(CONTRACT_ADDRESS, abi, walletWithProvider);

async function main() {

    
    // const auctionInfo = await vMAAuction_contract.auction();
    // console.log("The auctionInfo is: " + auctionInfo);

    const message = await vMAAuction_contract.settleCurrentAndCreateNewAuction();
    console.log("The message is: " + JSON.stringify(message));


    ///비드
    // const options = {value: ethers.utils.parseEther("1.3")}
    // const message = await vMAAuction_contract.createBid(3, options);
    // console.log("The message is: " + JSON.stringify(message));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
