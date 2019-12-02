const { createReadStream } = require('fs');
const path = require('path');

let ints = [];

function main(){
  return new Promise((resolve, reject) => {
    const readable = createReadStream(
      path.resolve(__dirname, 'input')
    )

    let leftovers = '';
    readable.on('data', chunk => {
      const currentData = leftovers + chunk.toString();
      const parts = currentData.split(/,/g);
      leftovers = parts.splice(parts.length-1, 1)[0];
      for( let val of parts ){
        ints.push(parseInt(val, 10))
      }
    });
    readable.on('end', () => {
      //finish up the leftovers
      if( leftovers.length ){
        ints.push(parseInt(leftovers, 10))
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
  //Pre-conditioning the code 1202
  ints[1] = 12;
  ints[2] = 2;
  //Off we go
  let opcodeIndex = 0;
  while( opcodeIndex < ints.length && ints[opcodeIndex] && ints[opcodeIndex] !== 99 ){
    const inputs = [
      ints[ints[opcodeIndex+1]],
      ints[ints[opcodeIndex+2]]
    ]
    const destination = ints[opcodeIndex+3];
    switch(ints[opcodeIndex]){
      case 1:
        //addition
        ints[destination] = inputs[0] + inputs[1];
      break;
      case 2:
        //multiplication
        ints[destination] = inputs[0] * inputs[1];
      break;
    }
    opcodeIndex += 4;
  }
  console.log(`Final value at position 0: ${ints[0]}`)
})
.catch(e => {
  console.error(e);
  process.exit(1);
});