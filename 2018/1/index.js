const { createReadStream } = require('fs');
const path = require('path');

let currentFrequency = 0;
let foundFrequencies = {};
let duplicate = undefined;
let firstFinalFrequency = 0;

function runFrequencyModulations(iteration = 0){
  const readable = createReadStream(
    path.resolve(__dirname, 'input')
  )

  let leftovers = '';
  readable.on('data', chunk => {
    const currentData = leftovers + chunk.toString();
    const parts = currentData.split(/\n/g);
    leftovers = parts.splice(parts.length-1, 1)[0];
    for( let modulation of parts ){
      if( modulation[0] === '+' ) {
        currentFrequency += parseInt(modulation.substr(1), 10);
      }
      else currentFrequency -= parseInt(modulation.substr(1), 10);
      if( duplicate === undefined ){
        foundFrequencies[currentFrequency] = foundFrequencies[currentFrequency] || 0;
        foundFrequencies[currentFrequency]++;
        if( foundFrequencies[currentFrequency] === 2 ){
          duplicate = currentFrequency;
        }
      }
    }
  });
  readable.on('end', () => {
    //finish up the leftovers
    if( leftovers.length ){
      if( leftovers[0] === '+' ) {
        currentFrequency += parseInt(leftovers.substr(1), 10);
      }
      else currentFrequency -= parseInt(leftovers.substr(1), 10); 
    }

    if( iteration === 0 ){
      firstFinalFrequency = currentFrequency;
    }
    
    iteration++;
  });
  readable.on('close', () => {
    if( duplicate === undefined ){
      runFrequencyModulations( iteration + 1 );
    }
    else {
      console.log(`Final frequency from first iteration: ${firstFinalFrequency}`);
      console.log(`First duplicate frequency: ${duplicate}`);
      console.log(`Total iterations: ${iteration+1}`)
    }
  })
}

runFrequencyModulations();