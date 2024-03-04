import { file } from 'bun';

const inputFile = file('day2.input');
const lines = (await inputFile.text()).split(/\n/g)

type Color = "red"|"green"|"blue";
const constraint: Record<Color, number> = {
  red: 12,
  green: 13,
  blue: 14
}

const getPullsFromGame = (gameString: string): string[] => gameString.substring(
  gameString.indexOf(": ") + 2
).split('; ')

const getCubesFromPull = (pullString: string): { color: Color, count: number }[] => {
  return pullString.split(', ').map(cube => {
    const [count, color] = cube.split(' ');
    return {
      count: Number(count),
      color: color as Color
    }
  })
}

const isGamePossible = (gameString: string) => {
  return !getPullsFromGame(gameString).some(pull => {
    return getCubesFromPull(pull).some(cube => {
      return constraint[cube.color] < cube.count;
    })
  })
}

const getPower = (gameString: string) => {
  const minCounts: Record<Color,number> = {
    red: 0,
    blue: 0,
    green: 0
  }

  getPullsFromGame(gameString).forEach(pull => {
    getCubesFromPull(pull).forEach(cube => {
      if( cube.count > minCounts[cube.color] ) {
        minCounts[cube.color] = cube.count
      }
    })
  })

  return minCounts.red * minCounts.blue * minCounts.green;
}

console.log(
  "part one",
  lines.reduce((agg, line) => {
    const id = Number(line.match(/Game (\d+):/)?.[1])
    if( isNaN(id) ) throw new Error("Failed to parse ID");
    if( isGamePossible(line) ) return agg + id;
    return agg;
  }, 0)
)

console.log(
  "part two",
  lines.reduce((agg, gameString) => {
    return getPower(gameString) + agg;
  }, 0)
)