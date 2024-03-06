import { file } from 'bun';
import { resolve } from 'path';
import { getParsedArgs } from "./day4.args";

const argv = getParsedArgs();
const filename = argv.mock ? 'day4.mock' : 'day4.input';
const inputFile = file(resolve(__dirname, filename));
const lines = (await inputFile.text()).split(/\n/g);

const parseLine = (line: string) => {
  // Line Structure: "Card  11: 12 34 56 78 90 | 83 86  6 31 17  9 48 53"
  const parts = line.split(/Card\s+|:\s|\s+\|\s+/g).slice(1) as [string, string, string];
  const card = parts[0];
  const winningNumbers = new Set(parts[1].split(/\s+/g).map(Number));
  // This may not have to be a set for part two. Who knows!
  const numbers = new Set(parts[2].split(/\s+/g).map(Number));
  const matchedNumbers = Array.from(numbers).filter(n => winningNumbers.has(n));
  const value = matchedNumbers.length ? Math.pow(2, matchedNumbers.length-1) : 0;
  return {
    card,
    value,
    winningNumbers,
    matchedNumbers,
    numbers,
  }
}

console.log(
  "Part One",
  lines.reduce((acc, line) => {
    return acc + parseLine(line).value;
  }, 0)
)