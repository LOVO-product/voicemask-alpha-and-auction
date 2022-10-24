# voicemask-alpha-and-auction
voicemask alpha and english auction   
플로우는 다음과 같습니다   
![flow](./update.png)


### 보이스마스크 NFT
json 업데이트시 json 안에있는 이미지파일 cid 도 업데이트하기   
옥션 배포후 nft 에 setMinter 하기


### json 추출
1. 인플루언서 csv 의 변수명을 수정한다(띄어쓰기 없이)     
2. /scripts/ops/csvToJsonFile.ts 를 실행하면 /jsonAsset에 json이 추출된다 