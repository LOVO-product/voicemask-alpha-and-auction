// require csvtojson
const csv = require("csvtojson");
const csvFilePath = "./scripts/ops/Influencer.csv";
import * as fs from 'fs';

//TODO json 업데이트시 json 안에있는 이미지파일 cid 도 업데이트하기
interface nft { attributes: { trait_type: string; value: any; }[]; description: string; image: string; name: string; }
async function main() {
    //Use async / await
    // const jsonArray = await csv().fromFile(csvFilePath);
    // console.log(jsonArray);

    await makeInfluencers();

}

const makeAuction = async (startIdx: number, totalAmount: number) => {
    const jsonArray = await csv().fromFile(csvFilePath);

    for (let i = startIdx; i < startIdx + totalAmount; i++) {
        let auction = {
            attributes: [
                {
                    trait_type: "Mask Type",
                    value: "Alpha"
                },
                {
                    trait_type: "Voice Type",
                    value: jsonArray[i].voice_type_metadata
                },
                {
                    trait_type: "Voice ID",
                    value: jsonArray[i].voice_id_metadata
                },
                {
                    trait_type: "Language",
                    value: jsonArray[i].language_metadata
                },
                {
                    trait_type: "Edition",
                    value: jsonArray[i].Edition_metadata
                },
            ],
            description: jsonArray[i].Description_PFP_Link + " " + jsonArray[i].Description_ENG_metadata,
            image: `https://lovo.mypinata.cloud/ipfs/QmTjatjspnsFudFBiRdwVmEuyVGFYVCA11TqYi2jN4h6jz/${i + 1}.png`,
            name: jsonArray[i].NFT_Name_metadata,
        }
        await saveFile(auction, i);
    }
}

const makeInfluencers = async () => {
    const jsonArray = await csv().fromFile(csvFilePath);

    let n = 3;//jsonArray.length;

    for (let i = 0; i < n; i++) {
        let influencer = {
            attributes: [
                {
                    trait_type: "Mask Type",
                    value: "Alpha"
                },
                {
                    trait_type: "Voice Type",
                    value: jsonArray[i].voice_type_metadata
                },
                {
                    trait_type: "Voice ID",
                    value: jsonArray[i].voice_id_metadata
                },
                {
                    trait_type: "Language",
                    value: jsonArray[i].language_metadata
                },
                {
                    trait_type: "Edition",
                    value: jsonArray[i].Edition_metadata
                },
            ],
            description: jsonArray[i].Description_PFP_Link + " " + jsonArray[i].Description_ENG_metadata,
            image: jsonArray[i].image,
            animation_url: jsonArray[i].animation_url,
            name: jsonArray[i].NFT_Name_metadata,
        }
        await saveFile(influencer, i + 1);

    }
}

const makeUnreveal = async (startIdx: number, totalAmount: number) => {

    for (let i = startIdx; i < startIdx + totalAmount; i++) {
        let sample = {
            attributes: [
                {
                    trait_type: "Mask Type",
                    value: "Alpha"
                },
            ],
            description: "Voice mask gave super power to chosen PFPs. Get ready for your NFTs.",
            image: `https://lovo.mypinata.cloud/ipfs/QmQjDdcVhmQo4L5TP319CAKySJCeq7zdTGxUNQ19mg5HUc/preview.gif`,
            name: `Voice Mask Alpha #${i}`,
        }
        await saveFile(sample, i);
    }
}


const saveFile = async (orig: nft, idx: number) => {
    console.log(orig);
    const json = JSON.stringify(orig);
    console.log(json);

    {
        fs.writeFileSync(`./jsonAsset/${idx}`, json);
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

