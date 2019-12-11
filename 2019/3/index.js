const argv = require('yargs-parser')(process.argv.slice(2))
const gatherInput = require('../../utils/gatherInput.js');

const visitedMap = {};
let currentShortestDistance;
let currentPosition = {
  x: 0,
  y: 0
};
let currentShortestPoint = {
  x: 0,
  y: 0
}
let currentWire = 0;

async function main(){
  try{
    await gatherInput(
      `2019/3/${argv.input || 'input'}`,
      (instruction, isNewWire) => { 
        if( isNewWire ){
          currentWire++;
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
        currentPosition.x += 1;
        checkCurrentPosition();
      }
      break;
    case "L":
      for( let i=0; i<amount; i++ ){
        currentPosition.x -= 1;
        checkCurrentPosition();
      }
      break;
    case "D":
      for( let i=0; i<amount; i++ ){
        currentPosition.y -= 1;
        checkCurrentPosition();
      }
      break;
    case "U":
      for( let i=0; i<amount; i++ ){
        currentPosition.y += 1;
        checkCurrentPosition();
      }
  }
}

function checkCurrentPosition(){
  if( !visitedMap[currentPosition.x] ) visitedMap[currentPosition.x] = {};
  if( currentWire === 2 && visitedMap[currentPosition.x][currentPosition.y] ){
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
  }
  else if( currentWire == 1){
    //this is the first time we have visited this node
    visitedMap[currentPosition.x][currentPosition.y] = true
  }
}

main();