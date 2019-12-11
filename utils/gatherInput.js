module.exports = async function (partHandler, splitOn){
  return new Promise((resolve, reject) => {
    const readable = createReadStream(
      path.resolve(__dirname, 'input')
    )

    let leftovers = '';
    readable.on('data', chunk => {
      const currentData = leftovers + chunk.toString();
      const parts = currentData.split(splitOn);
      leftovers = parts.splice(parts.length-1, 1)[0];
      for( let val of parts ){
        partHandler(val);
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