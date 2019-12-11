const { createReadStream } = require('fs');
const path = require('path');

module.exports = async function (inputPath, partHandler, splitOn){
  return new Promise((resolve, reject) => {
    const readable = createReadStream(
      path.resolve(__dirname, '../', inputPath)
    )

    let leftovers = '';
    let isLine = true;
    readable.on('data', chunk => {
      const currentData = leftovers + chunk.toString();
      const lines = currentData.split(/[\n\r]+/g).filter(line => line.length > 0);
      for( let lineIndex=0; lineIndex<lines.length; lineIndex++ ){
        if(lines[lineIndex-1] !== undefined ) isLine = true; //this is at least the second line here
        const parts = lines[lineIndex].split(splitOn);
        if( lines[lineIndex+1] === undefined ) leftovers = parts.splice(parts.length-1, 1)[0]; //last line
        for( let val of parts ){
          partHandler(val, isLine);
          isLine = false;
        }
      }
    });
    readable.on('end', () => {
      //finish up the leftovers
      if( leftovers.length ){
        partHandler(leftovers);
      }
    });
    readable.on('close', () => {
      resolve();
    });
    readable.on('error', err => {
      reject(err);
    })
  })
}