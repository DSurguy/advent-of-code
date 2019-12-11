const { createReadStream } = require('fs');
const path = require('path');
const argv = require('yargs-parser')(process.argv.slice(2))
const gatherInput = require('../../utils/gatherInput.js');

let ints = [];

async function main(){
  try{
    await gatherInput((val) => { ints.push(parseInt(val, 10)) }, /,/g)
  }
  catch (e){
    console.error(e);
    process.exit(1);
  }

  if( !argv.part || argv.part === 1 ){
    console.log(`Final value at position 0: ${processInputs(12, 2)}`)
  }
  else{
    for( let first = 0; first <= 99; first++ ){
      for( let second = 0; second <= 99; second++ ){
        const result = processInputs(first, second);
        if( result === 19690720 ){
          console.log(`Inputs resulting in 19690720: [${first},${second}]`);
          console.log(`100 * noun + verb: ${100*first+second}`);
          process.exit(0);
        }
      }
    }
    console.log(`Processed all inputs, unable to reach solution.`)
  }
}

function processInputs(first, second){
  const localInts = ints.slice(0);
  localInts[1] = first;
  localInts[2] = second;

  let opcodeIndex = 0;
  while( opcodeIndex < localInts.length && localInts[opcodeIndex] && localInts[opcodeIndex] !== 99 ){
    const inputs = [
      localInts[localInts[opcodeIndex+1]],
      localInts[localInts[opcodeIndex+2]]
    ]
    const destination = localInts[opcodeIndex+3];
    switch(localInts[opcodeIndex]){
      case 1:
        //addition
        localInts[destination] = inputs[0] + inputs[1];
      break;
      case 2:
        //multiplication
        localInts[destination] = inputs[0] * inputs[1];
      break;
    }
    opcodeIndex += 4;
  }

  return localInts[0]
}

main();