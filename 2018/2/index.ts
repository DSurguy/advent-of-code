const { createReadStream } = require('fs');
const path = require('path');

let duoCount = 0;
let triCount = 0;
const masks = {};
let matchedMask: string;

function main(){
  return new Promise<void>((resolve, reject) => {
    const readable = createReadStream(
      path.resolve(__dirname, 'input')
    )

    let leftovers = '';
    readable.on('data', chunk => {
      const currentData = leftovers + chunk.toString();
      const parts = currentData.split(/\n/g);
      leftovers = parts.splice(parts.length-1, 1)[0];
      for( let boxId of parts ){
        incrementCountsIfMatch(boxId);
        if( !matchedMask ) generateMasks(boxId);
      }
    });
    readable.on('end', () => {
      //finish up the leftovers
      if( leftovers.length ){
        incrementCountsIfMatch(leftovers);
        if( !matchedMask ) generateMasks(leftovers);
      }
    });
    readable.on('close', () => {
      console.log(`Final duo count: ${duoCount}`);
      console.log(`Final tri count: ${triCount}`);
      console.log(`Final checksum: ${duoCount*triCount}`);
      resolve();
    });
    readable.on('error', err => {
      reject(err);
    })
  })
}

function incrementCountsIfMatch(boxId){
  const charCounts = {};
  for( let i=0; i<boxId.length; i++ ){
    charCounts[boxId[i]] = (charCounts[boxId[i]] || 0 ) + 1;
  }
  const counts = Object.values(charCounts);
  let duo = false;
  let tri = false;
  for( let count of counts ){
    if( count === 2 ) duo = true
    if( count === 3 ) tri = true
  }
  if( duo ) duoCount++;
  if( tri ) triCount++;
}

async function generateMasks(boxId){
  for( let i=0; i<boxId.length; i++ ){
    let mask = boxId.substr(0, i) + '?' + boxId.substr(i+1);
    if( masks[mask] ){
      //this mask was already found, return this result.
      console.log(`Box ID 1: ${masks[mask]}`);
      console.log(`Box ID 2: ${boxId}`);
      matchedMask = mask.replace('?','');
      console.log(`Mask: ${matchedMask}`);
      return;
    }
    masks[mask] = boxId;
  }
}

main();