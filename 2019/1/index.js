const { createReadStream } = require('fs');
const path = require('path');

let totalFuelRequirement = 0;

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
        const mass = parseInt(row, 10);
        totalFuelRequirement += (Math.floor(mass/3) - 2);
      }
    });
    readable.on('end', () => {
      //finish up the leftovers
      if( leftovers.length ){
        const mass = parseInt(leftovers, 10);
        totalFuelRequirement += (Math.floor(mass/3) - 2);
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
.then(() => {
  console.log('complete')
  console.log(`Total Fuel Requirement: ${totalFuelRequirement}`);
})
.catch(e => {
  console.error(e);
  process.exit(1);
});