import { parseArgs } from 'util';
const gatherInput = require('../../utils/gatherInput.js');

type Args = {
  input?: String;
}
function getParsedArgs (): Args {
  const { values: rawArgv } = parseArgs({
    args: Bun.argv,
    options: {
      input: {
        type: 'string',
        alias: 'i'
      }
    },
    allowPositionals: true
  })
  const convert: Record<string, Function> = {}
  Object.entries(convert).forEach(([key, fn]) => {
    if( rawArgv[key] ){
      rawArgv[key] = fn(rawArgv[key]);
    }
  })
  return rawArgv as Args;
}
const argv = getParsedArgs();

const visitedMap = {};
let currentShortestDistance;
let currentFewestInstructions;
let currentPosition = {
  x: 0,
  y: 0
};
let currentShortestPoint = {
  x: 0,
  y: 0
}
let currentFewestInstructionsPoint = {
  x: 0,
  y: 0
}
let currentWire = 0;
let currentWireInstructions = 0;

async function main(){
  try{
    await gatherInput(
      `2019/3/${argv.input || 'input'}`,
      (instruction, isNewWire) => { 
        if( isNewWire ){
          currentWire++;
          currentWireInstructions = 0;
          currentPosition = {
            x: 0,
            y: 0
          }
        }
        layWire(instruction)
      },
      /,/g
    )

    console.log(`Shortest Manhattan Distance: ${currentShortestDistance}`)
    console.log(`Position of closest cross: [${currentShortestPoint.x},${currentShortestPoint.y}]`)
    console.log(`Fewest Instructions: ${currentFewestInstructions}`)
    console.log(`Position of cross with fewest instructions: [${currentFewestInstructionsPoint.x},${currentFewestInstructionsPoint.y}]`)
  }
  catch (e){
    console.error(e);
    process.exit(1);
  }

  
}

function layWire(instruction){
  const direction = instruction[0];
  const amount = parseInt(instruction.substr(1), 10);
  switch(direction){
    case "R":
      for( let i=0; i<amount; i++ ){
        currentWireInstructions++;
        currentPosition.x += 1;
        checkCurrentPosition();
      }
      break;
    case "L":
      for( let i=0; i<amount; i++ ){
        currentWireInstructions++;
        currentPosition.x -= 1;
        checkCurrentPosition();
      }
      break;
    case "D":
      for( let i=0; i<amount; i++ ){
        currentWireInstructions++;
        currentPosition.y -= 1;
        checkCurrentPosition();
      }
      break;
    case "U":
      for( let i=0; i<amount; i++ ){
        currentWireInstructions++;
        currentPosition.y += 1;
        checkCurrentPosition();
      }
  }
}

function checkCurrentPosition(){
  //init the x,y position in the map
  if( !visitedMap[currentPosition.x] ) visitedMap[currentPosition.x] = {};
  if( !visitedMap[currentPosition.x][currentPosition.y] ) visitedMap[currentPosition.x][currentPosition.y] = {};
  //store the current wire's total steps to date (if it's the first time we've visited)
  if( visitedMap[currentPosition.x][currentPosition.y][currentWire] === undefined ){
    visitedMap[currentPosition.x][currentPosition.y][currentWire] = currentWireInstructions;
  }

  if( currentWire === 2 && visitedMap[currentPosition.x][currentPosition.y][1] !== undefined ){
    //check to see if this is the new closest point
    const currentDistance = Math.abs(currentPosition.x) + Math.abs(currentPosition.y);
    if( 
      currentShortestDistance === undefined
      || currentDistance < currentShortestDistance
    ){
      //update our winner
      currentShortestDistance = currentDistance;
      Object.assign(currentShortestPoint, currentPosition);
    }

    //Now check to see if this is the new fewest set of instructions
    const currentInstructions = visitedMap[currentPosition.x][currentPosition.y][1]
      + visitedMap[currentPosition.x][currentPosition.y][2]
    if( currentFewestInstructions === undefined || currentInstructions < currentFewestInstructions ){
      currentFewestInstructions = currentInstructions;
      Object.assign(currentFewestInstructionsPoint, currentPosition);
    }
  }
}

main();