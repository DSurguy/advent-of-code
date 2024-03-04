import { parseArgs } from 'util';
const inputs = require("./inputs.json") as { min: number, max: number };

type Args = {
  part?: number;
}
function getParsedArgs (): Args {
  const { values: rawArgv } = parseArgs({
    args: Bun.argv,
    options: {
      part: {
        type: 'string',
        alias: 'p'
      }
    },
    allowPositionals: true
  })
  const convert: Record<string, Function> = {
    part: (v: string): number => Number(v)
  }
  Object.entries(convert).forEach(([key, fn]) => {
    if( rawArgv[key] ){
      rawArgv[key] = fn(rawArgv[key]);
    }
  })
  return rawArgv as Args;
}
const argv = getParsedArgs();

function isValidPassword(password){
  let hasDouble = false;
  let hasDecreased = false;

  let currentChainCount = 0;
  let currentChainValue;
  for( let i=0; i<password.length; i++ ){
    const currentValue = password[i];

    //Check to see if we've descreased in value
    if( currentChainValue !== undefined && currentChainValue > currentValue ) hasDecreased = true;

    //Check to see if we're chaining the same number
    if( currentValue === currentChainValue ){
      //the characters were the same, bump the chain count
      currentChainCount++;
      //If we're at the end, handle it special
      if( i === password.length-1 && currentChainCount === 2) hasDouble = true;
    }
    else{
      //the current and last number were different
      if( chainCountsAsDouble(currentChainCount) ) hasDouble = true; //We had a chain of 2 before this, so there's a real double
      currentChainCount = 1; //reset the chain count
      currentChainValue = currentValue; //change the chain character
    }
  }

  if( hasDouble && !hasDecreased ){
    return true;
  }
  return false;
}

function chainCountsAsDouble(chainCount){
  if ( argv.part === 2 ){
    return chainCount === 2;
  }
  else {
    return chainCount >= 2;
  }
}

const validPasswords: number[] = [];
for( let password = inputs.min; password <= inputs.max; password++ ){
  if( isValidPassword(password.toString()) ){
    validPasswords.push(password)
  }
}
console.log(`${validPasswords.length} valid passwords`);