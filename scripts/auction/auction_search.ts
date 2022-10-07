import { ethers } from "ethers";

const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", "QSuGf9zqKJy_SxE6yKOwA1mMjzSw0m8B");
const CONTRACT_ADDRESS = "0x97F758686A68c01a3a612625F8Da79AEe33D5929";

let abi = [
    "event AuctionBid(uint256 indexed alphaId, address sender, uint256 value, bool extended)"
];

const vMAAuction_contract = new ethers.Contract(CONTRACT_ADDRESS, abi, alchemyProvider);


async function main() {

    let auctionFilter = vMAAuction_contract.filters.AuctionBid(3);
    let list = await vMAAuction_contract.queryFilter(auctionFilter);
    // console.log(list);
    console.log(list[0].args);
    //4가지 값 파싱
    console.log(list[0].args?.alphaId.toString());
    console.log(list[0].args?.sender);
    console.log(ethers.utils.formatEther(list[0].args?.value)," ETH");
    console.log(list[0].args?.extended);
    
} 

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
