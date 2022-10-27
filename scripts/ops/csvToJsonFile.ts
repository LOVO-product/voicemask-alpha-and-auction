// require csvtojson
const csv = require("csvtojson");
const csvFilePath = "./scripts/ops/Influencer_ex.csv";
import * as fs from 'fs';

//TODO json 업데이트시 json 안에있는 이미지파일 cid 도 업데이트하기
interface nft { attributes: { trait_type: string; value: any; }[]; description: string; image: string; name: string; }
async function main() {
    //Use async / await
    const jsonArray = await csv().fromFile(csvFilePath);
    // console.log(jsonArray);

    let n = 30;//jsonArray.length;

    for (let i = 0; i < n; i++) {
        // let one = {
        //     attributes: [
        //         {
        //             trait_type: "Mask Type",
        //             value: "Alpha"
        //         },
        //         {
        //             trait_type: "Voice",
        //             value: jsonArray[i].Voice_ID
        //         },
        //         {
        //             trait_type: "Name",
        //             value: jsonArray[i].Name
        //         }
        //     ],
        //     description: "Voice mask gave super power to chosen PFPs. Now your PFPs can speak Korean.",
        //     image: `https://lovo.mypinata.cloud/ipfs/QmXn1Fmz5Wh7nYg5yZnb62TYbxj7vW7gt3BwceMf27YAz2/${i}.png`,
        //     name: `Voice Mask Alpha #${jsonArray[i].Name}`,
        // }
        // await saveFile(one, i);

        let sample = {
            attributes: [
                {
                    trait_type: "Mask Type",
                    value: "Alpha"
                },
            ],
            description: "Voice mask gave super power to chosen PFPs. Get ready for your NFTs.",
            image: `https://lovo.mypinata.cloud/ipfs/QmQjDdcVhmQo4L5TP319CAKySJCeq7zdTGxUNQ19mg5HUc/preview.gif`,
            animation: `https://lovo.mypinata.cloud/ipfs/QmQjDdcVhmQo4L5TP319CAKySJCeq7zdTGxUNQ19mg5HUc/preview.gif`,
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

