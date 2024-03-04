import { file } from 'bun';

const isSymbol = (s: string = '') => /[^\d\.]/.test(s);
const isDigit = (s: string = '') => /\d/.test(s);
const isGear = (s: string = '') => /\*/.test(s);

const inputFile = file('day3.input');
const lines = (await inputFile.text()).split(/\n/g);

type SchematicItem = {
  value: string,
  isSymbol: boolean,
  isDigit: boolean,
  ref: Symbol
};

const inputSchematic: SchematicItem[][] = lines.map(line => line.split('').map(char => ({
  value: char,
  isSymbol: isSymbol(char),
  isDigit: isDigit(char),
  ref: Symbol()
})))
const schematicMap = inputSchematic.reduce((agg, line) => {
  return line.reduce((_agg, item) => {
    _agg.set(item.ref, item)
    return _agg;
  }, agg)
}, new Map<Symbol, SchematicItem>())

const getAdjacentTools = (schematic: SchematicItem[][], y: number, x: number): Symbol[] => {
  const points = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ]

  let matchingPoint: number[] | undefined = undefined;
  return points.map(([pointY, pointX]) => {
    const item = schematic[pointY + y]?.[pointX + x];
    if( item?.isSymbol ) {
      return item.ref;
    }
    return undefined;
  }).filter((v: Symbol | undefined): v is Symbol => v !== undefined)
}

type Tool = {
  symbol: string,
  parts: Symbol[]
}

type Part = {
  number: string,
  isPartNumber: boolean,
  tools: Set<Symbol>,
  refs: Symbol[],
}

// TODO: finish it I guess
const parseSchematic = (schematic: SchematicItem[][]) => {
  const parts: Part[] = [];
  const tools: Tool[] = [];

  let partialNumber: Part | null = null;

  const applyItemToPartialNumber = (item: SchematicItem, y: number, x: number) => {
    if( !partialNumber ) {
      partialNumber = {
        number: item.value,
        isPartNumber: false,
        tools: new Set<Symbol>()
      }
    }
    
    const toolRefs = getAdjacentTools(schematic, y, x)
    toolRefs.forEach(toolRef => {
      partialNumber!.tools.add(toolRef);
    })
  }

  const resetPartialNumber = () => {
    partialNumber = null;
  }

  for( let y=0; y < schematic.length; y++ ) {
    const line = schematic[y];
    for( let x=0; x < line.length; x++ ) {
      const item = line[x];

      if( item.isDigit ) {
        
      }
    }
  }

  // console.log(partNumbers);
  return partNumbers.reduce((_, v) => _ + v, 0);
}

console.log("part one", getPartSum(inputSchematic))