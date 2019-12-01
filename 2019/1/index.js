const { createReadStream } = require('fs');
const path = require('path');

function main(){
  return new Promise((resolve, reject) => {
    const readable = createReadStream(
      path.resolve(__dirname, 'input')
    )

    let leftovers = '';
    readable.on('data', chunk => {
      const currentData = leftovers + chunk.toString();
      const parts = currentData.split(/\n/g);
      leftovers = parts.splice(parts.length-1, 1)[0];
      for( let row of parts ){
        //TODO: Parse row
      }
    });
    readable.on('end', () => {
      //finish up the leftovers
      if( leftovers.length ){
        //TODO: Handle leftovers
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

main()
.then(() => console.log('complete'))
.catch(e => {
  console.error(e);
  process.exit(1);
});