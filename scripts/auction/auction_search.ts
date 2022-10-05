import { ethers } from "ethers";

const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", "QSuGf9zqKJy_SxE6yKOwA1mMjzSw0m8B");
const CONTRACT_ADDRESS = "0x54195c61528D4DC90Ae3dd943754ed3E63B60363";

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
