const argv = require('yargs-parser')(process.argv.slice(2))
const inputs = require("./inputs.json");

const validPasswords = [];

async function main(){
  for( let password = inputs.min; password <= inputs.max; password++ ){
    if( isValidPassword(password.toString()) ){
      validPasswords.push(password)
    }
  }
  console.log(`${validPasswords.length} valid passwords`);
}

function isValidPassword(password){
  let hasDouble = false;
  let hasDecreased = false;

  for( let i=0; i<password.length; i++ ){
    if( password[i-1] === password[i] ) hasDouble = true;
    if( password[i-1] !== undefined && password[i-1] > password[i] ) hasDecreased = true;
  }

  if( hasDouble && !hasDecreased ){
    return true;
  }
  return false;
}

main();