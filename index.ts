import { exec, spawn } from 'child_process';
import { resolve } from 'path';
const argv = require('yargs-parser')(process.argv.slice(2))

function getPuzzleStringHelpMessage(puzzleString: string): string{
  return `
    The puzzle you provided, "${puzzleString}", does not match a known format.
    The supported formats are:
     - <year>.<day>[.<part>]
     - <year>/<day>[/<part>]
    Examples: 2019/14/2 , 2018.1
  `
}

function parsePuzzle(puzzle: string): {
  year: string;
  day: string;
  part: string | undefined
}{
  //Test the puzzle for validity and extraact the year, day and part
  const result = puzzle.match(/(\d{4})[\.\/](\d\d?)([\.\/](\d+))?/);
  if( !result ) throw new Error(getPuzzleStringHelpMessage(puzzle))
  const [, year, day, , part] = result;  
  return { year, day, part }
}

const puzzle = (argv.p || argv.puzzle || '').toString() as string;
const { year, day, part } = parsePuzzle(puzzle);

const puzzleDir = `${year}/${day}/index`;

const spawnArgs = [puzzleDir]
if( part ) spawnArgs.push(`--part ${part}`)

spawn(
  `ts-node`, 
  spawnArgs,
  {
    stdio: 'inherit',
    shell: true
  }
).on('error', err => console.error(err))