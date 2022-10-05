import { ethers } from "ethers";


let PRIVATE_KEY = "0x4dfc9e11b48940aef89baf6a525fa7840caffd1cd3a2ccf6ec0cff78f8898ebe";
const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", "QSuGf9zqKJy_SxE6yKOwA1mMjzSw0m8B");
let walletWithProvider = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const CONTRACT_ADDRESS = "0x54195c61528D4DC90Ae3dd943754ed3E63B60363";

let abi = [
    "function auction() view external returns(uint256 alphaId, uint256 price, uint256 startTime, uint256 endTime, address payable bidder,bool settled)",
    "function settleCurrentAndCreateNewAuction() external"
];

const vMAAuction_contract = new ethers.Contract(CONTRACT_ADDRESS, abi, walletWithProvider);

async function main() {

    
    const auctionInfo = await vMAAuction_contract.auction();
    console.log("The auctionInfo is: " + auctionInfo);

    // const message = await vMAAuction_contract.settleCurrentAndCreateNewAuction();
    // console.log("The message is: " + JSON.stringify(message));

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
