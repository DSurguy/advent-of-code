import { file } from 'bun';
import { resolve } from 'path';
import { getParsedArgs } from "./day5.args";
import { sortedInsert } from '../../utils/sortedInsert';

const argv = getParsedArgs();
const filename = argv.mock ? 'day5.mock' : 'day5.input';
const inputFile = file(resolve(__dirname, filename));
const lines = (await inputFile.text()).split(/\n/g);

// All inputs appear to be positive, so we can use -1 to represent
// an inconvertible value
const getSeedsFromLine = (line: string): bigint[] => {
  return line.split(' ').map(v => {
    try { 
      return BigInt(v);
    } catch {
      return -1n;
    }
  }).filter(v => v > 0n);
}

const getMapFromLine = (line: string): PlantingMap => {
  const [destinationStart, sourceStart, range] = line.split(' ').map(BigInt);
  return {
    sourceStart,
    destinationStart,
    range
  };
}


type PlantingMap = {
  sourceStart: bigint;
  destinationStart: bigint;
  range: bigint;
}
const maps = {
  soil: [] as PlantingMap[],
  fertilizer: [] as PlantingMap[],
  water: [] as PlantingMap[],
  light: [] as PlantingMap[],
  temperature: [] as PlantingMap[],
  humidity: [] as PlantingMap[],
  location: [] as PlantingMap[],
}
const labelToMap = {
  'seed-to-soil': maps.soil,
  'soil-to-fertilizer': maps.fertilizer,
  'fertilizer-to-water': maps.water,
  'water-to-light': maps.light,
  'light-to-temperature': maps.temperature,
  'temperature-to-humidity': maps.humidity,
  'humidity-to-location': maps.location,
}

let seeds: bigint[] = [];
let mapRef: null | PlantingMap[] = null;
lines.forEach(line => {
  if (line.trim() === '') return;

  if (line.startsWith('seeds')) {
    seeds = getSeedsFromLine(line);
    return;
  }

  if (/^[a-z]/.test(line)) {
    const label = line.split(' ')[0] as keyof typeof labelToMap;
    console.log(label)
    mapRef = labelToMap[label];
    return;
  }

  const map = getMapFromLine(line);

  // // I tried to be clever here, it didn't work
  // sortedInsert(mapRef!, map, (a, b) => {
  //   //console.log(a, b);
  //   return a.sourceStart > b.sourceStart 
  //   ? 1 
  //   : a.sourceStart < b.sourceStart
  //     ? -1
  //     : 0
  // });
  mapRef!.push(map);
})

const mapOrder = [
  maps.soil,
  maps.fertilizer,
  maps.water,
  maps.light,
  maps.temperature,
  maps.humidity,
  maps.location
];

// sample soil for now
const getMappedValue = (map: PlantingMap[], value: bigint): bigint => {
  const validMap = map.find(map => {
    return value >= map.sourceStart && value <= map.sourceStart + map.range;
  })
  if( validMap ){
    return validMap.destinationStart + (value - validMap.sourceStart);
  }
  else return value;
}

console.log(
  'Part One',
  seeds.reduce((lowestLocation, seed) => {
    const location = mapOrder.reduce((val, map) => {
      return getMappedValue(map, val)!;
    }, seed)
    if( lowestLocation === -1n ) return location;
    return location < lowestLocation ? location : lowestLocation;
  }, -1n)
)

const seedPairs = seeds.reduce((acc, seed, index) => {
  if( index % 2 === 0 ) {
    acc.push([seed, 0n]);
  } else {
    acc[acc.length - 1][1] = seed;
  }
  
  return acc;
}, [] as [bigint, bigint][])
console.log(
  'Part Two',
  seedPairs.reduce((lowestLocation, [start, range]) => {
    console.log("Crunching pair", start, range)
    let lowestPairLocation: bigint = -1n;
    for( let i=0n; i<range; i++ ){
      const location = mapOrder.reduce((val, map) => {
        return getMappedValue(map, val)!;
      }, start + i)
      if( lowestPairLocation === -1n ) lowestPairLocation = location;
      else if( location < lowestPairLocation ) lowestPairLocation = location
    }
    if( lowestLocation === -1n ) return lowestPairLocation;
    return lowestPairLocation < lowestLocation ? lowestPairLocation : lowestLocation;
  }, -1n)
)