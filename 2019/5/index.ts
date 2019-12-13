const argv: {
  part?: number;
  input?: string;
} = require('yargs-parser')(process.argv.slice(2));
const gatherInput = require('../../utils/gatherInput.js');

import IntcodeProcessor from '../shared/intcodeProcessor';

const ints: number[] = [];

async function main(){
  await gatherInput(
    `2019/5/${argv.input || 'input'}`,
    (int: string) => { 
      ints.push(parseInt(int, 10));
    },
    /,/g
  )

  const processor = new IntcodeProcessor();
  const inputs = !argv.part || argv.part === 1 ? [1] : undefined;

  await processor.process(ints, inputs);
}

main()