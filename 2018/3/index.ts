const { createReadStream } = require('fs');
const path = require('path');

const grid = {}
const nonOverlappingIds = {};
let overlapTotal = 0;

function main(){
  return new Promise<void>((resolve, reject) => {
    const readable = createReadStream(
      path.resolve(__dirname, 'input')
    )

    let leftovers = '';
    readable.on('data', chunk => {
      const currentData = leftovers + chunk.toString();
      const parts = currentData.split(/\n/g);
      leftovers = parts.splice(parts.length-1, 1)[0];
      for( let row of parts ){
        crawlRectangle(
          getRectangleDefinition(row)
        )
      }
    });
    readable.on('end', () => {
      //finish up the leftovers
      if( leftovers.length ){
        crawlRectangle(
          getRectangleDefinition(leftovers)
        )
      }
    });
    readable.on('close', () => {
      console.log(`Final overlap total: ${overlapTotal}`);
      console.log(`Non-overlapping rects: ${Object.keys(nonOverlappingIds).join(',')}`);
      resolve();
    });
    readable.on('error', err => {
      reject(err);
    })
  })
}

function getRectangleDefinition(str){
  const rectParts = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/.exec(str);
  if( !rectParts ) throw new Error("Rect cannot be parsed");
  return {
    id: rectParts[1],
    x: parseInt(rectParts[2], 10),
    y: parseInt(rectParts[3], 10),
    width: parseInt(rectParts[4], 10),
    height: parseInt(rectParts[5], 10)
  }
}

function crawlRectangle(rect){
  nonOverlappingIds[rect.id] = true;
  for( let x=rect.x; x<rect.x+rect.width; x++ ){
    for( let y=rect.y; y<rect.y+rect.height; y++ ){
      if( !grid[x] ) grid[x] = {};
      if( !grid[x][y] ) grid[x][y] = [];
      grid[x][y].push(rect.id);
      if( grid[x][y].length > 1 ){
        //this is an overlapping cell
        delete nonOverlappingIds[rect.id];
        if( grid[x][y].length === 2 ){
          //this is the first time this cell has overlapped
          overlapTotal++;
          delete nonOverlappingIds[grid[x][y][0]]
        }
      }
    }
  }
}

main()
.then(() => console.log('complete'))
.catch(e => {
  console.error(e);
  process.exit(1);
});