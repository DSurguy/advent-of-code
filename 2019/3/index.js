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

  
}

main();