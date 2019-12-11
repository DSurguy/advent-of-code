const argv = require('yargs-parser')(process.argv.slice(2))
const input = require("./inputs.json");

async function main(){
  console.log(input)
}

main();