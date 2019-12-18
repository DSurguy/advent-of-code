const colors = require('colors');
const argv: {
  part?: number;
  input?: string;
  test?: boolean;
} = require('yargs-parser')(process.argv.slice(2));
const gatherInput = require('../../utils/gatherInput.js');
const testSuite: {
  testId: string;
  description: string;
  io: {
    input: number[];
    output: number[];
  }[]
}[] = require('./testSuite.json');

import IntcodeProcessor from '../shared/intcodeProcessor';

const ints: number[] = [];

async function main(){
  if( argv.test ){
    await runTestSuite();
    process.exit(0);
  }
  await gatherInput(
    `2019/5/${argv.input || 'input'}`,
    (int: string) => { 
      ints.push(parseInt(int, 10));
    },
    /,/g
  )

  const processor = new IntcodeProcessor();
  
  let inputs;
  if( argv.part !== 2 ){
    inputs = [1];
  }
  else if( argv.part === 2 ){
    if( !argv.input || argv.input === 'input' ){
      inputs = [5];
    }
    //otherwise prompt
  }

  await processor.process(ints, inputs);
}

async function runTestSuite(){
  console.log("====== Running test suite ======");
  for( let test of testSuite ){
    console.log(`[${test.testId}]: ${test.description}`)
    const testInts = [];
    const processor = new IntcodeProcessor();
    await gatherInput(
      `2019/5/testInput.${test.testId}`,
      (int: string) => {
        testInts.push(parseInt(int, 10));
      },
      /,/g
    )
    
    for( let io of test.io ){
      console.log(` input    ${io.input.join(',')}`)
      await processor.process(testInts.slice(0), io.input);
      const coloredOutput = compareTestOutput(processor.output, io.output)
      ? colors.green(` output   ${processor.output.join(',')}`)
      : colors.red(` output   ${processor.output.join(',')}`)
      console.log(coloredOutput)
      console.log(` expected ${io.output.join(',')}`)
      console.log(` ----- `)
    }
  }
  console.log("Test suite complete");
}

function compareTestOutput(output, expected){
  if( output.length !== expected.length ) return false;
  for( let i=0; i<expected.length; i++ ){
    if( output[i] !== expected[i] ) return false;
  }
  return true;
}

main()