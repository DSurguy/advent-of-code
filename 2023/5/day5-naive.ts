import { file } from 'bun';
import { resolve } from 'path';
import { getParsedArgs } from "./day5.args";

const argv = getParsedArgs();
const filename = argv.mock ? 'day5.mock' : 'day5.input';
const inputFile = file(resolve(__dirname, filename));
const lines = (await inputFile.text()).split(/\n/g);

type PlantingMap = Record<number, number | undefined>;

const maps = {
  soil: {} as PlantingMap,
  fertilizer: {} as PlantingMap,
  water: {} as PlantingMap,
  light: {} as PlantingMap,
  temperature: {} as PlantingMap,
  humidity: {} as PlantingMap,
  location: {} as PlantingMap,
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

let seeds: number[] = [];

const getMappedValue = (map: PlantingMap, key: number) => {
  if (map[key] === undefined) return key;
  return map[key];
}

const getSeedsFromLine = (line: string): number[] => {
  return line.split(' ').map(Number).filter(v => !isNaN(v));
}

const getMapFromLine = (line: string): PlantingMap => {
  const [destinationStart, sourceStart, range] = line.split(' ').map(Number);
  const map = {} as PlantingMap;
  for (let i = 0; i < range; i++) {
    map[sourceStart + i] = destinationStart + i;
  }
  return map;
}

let mapRef: null | PlantingMap = null;
lines.forEach(line => {
  if (line.trim() === '') return;

  if (line.startsWith('seeds')) {
    seeds = getSeedsFromLine(line);
    return;
  }

  if (/^[a-z]/.test(line)) {
    const label = line.split(' ')[0] as keyof typeof labelToMap;
    mapRef = labelToMap[label];
    return;
  }

  // This is a map line
  const map = getMapFromLine(line);
  Object.assign(mapRef!, map);
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
// TODO: Overhaul algorithm, will be WAY too slow for real input
console.log(
  'Part One',
  seeds.reduce((lowestLocation, seed) => {
    const location = mapOrder.reduce((val, map) => {
      return getMappedValue(map, val)!;
    }, seed)
    if( lowestLocation === -1 ) return location;
    return location < lowestLocation ? location : lowestLocation;
  }, -1)
)