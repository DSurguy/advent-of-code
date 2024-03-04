import { file } from 'bun';

const inputFile = file('day1.input');
const lines = (await inputFile.text()).split(/\n/g)

const numberWordRegex = () => /one|two|three|four|five|six|seven|eight|nine|\d/g

type NumberWord = "one"|"two"|"three"|"four"|"five"|"six"|"seven"|"eight"|"nine";

const stupidNumberMap: Record<NumberWord, string> = {
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9'
}

const getFullNumber = (str: string, useWords = true): number => {
  const regex = useWords ? numberWordRegex() : /\d/g;
  const matches: string[] = [];
  let match = regex.exec(str);
  while(match?.[0]) {
    matches.push(match[0]);
    if( match[0].length > 1 ) regex.lastIndex = match.index + 1;
    match = regex.exec(str);
  }
  if( !matches ) throw new Error("failed to match string");

  let first = matches[0];
  if( first.length > 1 ) {
    first = stupidNumberMap[first as NumberWord];
  }
  let last = matches.slice(-1)[0];
  if( last.length > 1 ) {
    last = stupidNumberMap[last as NumberWord];
  }
  return Number(`${first}${last}`)
}

console.log(
  "part one",
  lines.reduce((agg, val) => {
    return agg + getFullNumber(val, false)
  }, 0)
)

console.log(
  "part two",
  lines.reduce((agg, val) => {
    return agg + getFullNumber(val)
  }, 0)
)