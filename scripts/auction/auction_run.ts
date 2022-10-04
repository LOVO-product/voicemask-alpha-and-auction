import { ethers } from "ethers";


let privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", "QSuGf9zqKJy_SxE6yKOwA1mMjzSw0m8B");

let walletWithProvider = new ethers.Wallet(privateKey, alchemyProvider);


const CONTRACT_ADDRESS = "";
let abi = [
    "function settleCurrentAndCreateNewAuction() external"
];

const vMAAuction = new ethers.Contract(CONTRACT_ADDRESS, abi, walletWithProvider);

async function main() {

    // const auctionInfo = await vMAAuction.auction();
    // console.log("The auctionInfo is: " + auctionInfo);


    const message = await vMAAuction.settleCurrentAndCreateNewAuction();
    console.log("The message is: " + message);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
