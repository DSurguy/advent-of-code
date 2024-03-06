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
  const card = Number(parts[0]);
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

let totalPoints = 0;
const cardCount = new Map<number, number>();
lines.forEach(line => {
  const parsedLine = parseLine(line);
  totalPoints += parsedLine.value;
  const finalThisCardCount = (cardCount.get(parsedLine.card) || 0) + 1;
  cardCount.set(parsedLine.card, finalThisCardCount);
  for( let i = 0; i < parsedLine.matchedNumbers.length; i++ ) {
    cardCount.set(
      parsedLine.card + i + 1,
      (cardCount.get(parsedLine.card + i + 1) || 0) + finalThisCardCount
    )
  }
})

console.log(
  "Part One",
  totalPoints
)

console.log(
  "Part Two",
  Array.from(cardCount.values()).reduce((acc, val) => acc + val, 0)
)