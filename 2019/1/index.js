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
        addModuleFuel(parseInt(row, 10));
      }
    });
    readable.on('end', () => {
      //finish up the leftovers
      if( leftovers.length ){
        addModuleFuel(parseInt(leftovers, 10));
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

function addModuleFuel(mass){
  let fuelRequired = (Math.floor(mass/3) - 2);
  while(fuelRequired > 0) {
    totalFuelRequirement += fuelRequired;
    fuelRequired = (Math.floor(fuelRequired/3) - 2);
  }
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