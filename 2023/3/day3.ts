import { file } from 'bun';
import { resolve } from 'path';
import { getParsedArgs } from './getArgs';

const argv = getParsedArgs();

const isSymbol = (s: string = '') => /[^\d\.]/.test(s);
const isDigit = (s: string = '') => /\d/.test(s);
const isGear = (s: string = '') => /\*/.test(s);

const filename = argv.mock ? 'day3.mock' : 'day3.input';
const inputFile = file(resolve(__dirname, filename));
const lines = (await inputFile.text()).split(/\n/g);

type SchematicNode = {
  value: string;
  isSymbol: boolean;
  isDigit: boolean;
  ref: Symbol;
};

const inputSchematic: SchematicNode[][] = lines.map(line => line.split('').map(char => ({
  value: char,
  isSymbol: isSymbol(char),
  isDigit: isDigit(char),
  ref: Symbol(),
})))
const schematicItemByRef = new Map<Symbol, SchematicNode>();
const schematicItemByPosition = new Map<string, SchematicNode>(); // `${x},${y}`
inputSchematic.forEach((line, y) => {
  line.forEach((item, x) => {
    schematicItemByPosition.set(`${y},${x}`, item);
    schematicItemByRef.set(item.ref, item);
  })
})

const getAdjacentTools = (schematic: SchematicNode[][], y: number, x: number): Symbol[] => {
  const points = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ]

  return points.map(([pointY, pointX]) => {
    const item = schematicItemByPosition.get(`${pointY + y},${pointX + x}`);
    if( item?.isSymbol ) {
      return item.ref;
    }
    return undefined;
  }).filter((v: Symbol | undefined): v is Symbol => v !== undefined)
}

type Tool = {
  symbol: string;
  adjacentParts: Set<Part>;
}

type Part = {
  number: string;
  toolNodes: Set<Symbol>;
  digitNodes: Symbol[];
}

const parseSchematic = (schematic: SchematicNode[][]) => {
  // Tools can be referenced by their schematic node
  const tools = new Map<Symbol, Tool>();
  // Parts will be referenced by their schematic nodes as well
  const parts: Part[] = [];
  const partsByRef = new Map<Symbol, Part>();

  let partialNumber: Part | null = null;

  for( let y=0; y<schematic.length; y++ ) {
    for( let x=0; x<schematic[y].length; x++ ) {
      const item = schematic[y][x];
      if( item.isDigit ) {
        if( !partialNumber ) {
          partialNumber = {
            number: '',
            toolNodes: new Set<Symbol>(),
            digitNodes: [],
          }
        }
        // What's the point of a null check if it doesn't work
        const definitelyPartialNumber = partialNumber as Part;

        definitelyPartialNumber.digitNodes.push(item.ref);
        definitelyPartialNumber.number += item.value;
        // Detect adjacent tools and update the part tool list
        // Also create tools if they don't exist
        const toolNodes = getAdjacentTools(schematic, y, x);
        toolNodes.forEach(toolNode => {
          definitelyPartialNumber.toolNodes.add(toolNode);
          if( !tools.has(toolNode) ) {
            tools.set(toolNode, {
              symbol: schematicItemByRef.get(toolNode)!.value,
              adjacentParts: new Set<Part>([definitelyPartialNumber]),
            })
          } else {
            tools.get(toolNode)!.adjacentParts.add(definitelyPartialNumber);
          }
        });
      }
      else {
        if( partialNumber ) {
          parts.push(partialNumber);
          partialNumber = null;
        }
        if( item.isSymbol ) {
          // Add it to our nodes if we haven't seen it before
          if( !tools.has(item.ref) ) {
            tools.set(item.ref, {
              symbol: schematicItemByRef.get(item.ref)!.value,
              adjacentParts: new Set<Part>(),
            })
          }
        }
      }
    }
  }

  return {
    tools,
    parts,
    partsByRef
  };
}

const getPartSum = (parts: Part[]): number => {
  return parts.reduce((agg, part) => agg + Number(part.number), 0);
}

const getGearSum = (gears: Tool[]) => {
  const gearSum = gears.reduce((agg, gear) => {
    const adjacentParts = Array.from(gear.adjacentParts).map(part => part.number);
    return agg + Number(adjacentParts[0]) * Number(adjacentParts[1]);
  }, 0);
  return gearSum;
}

const { tools, parts } = parseSchematic(inputSchematic);

console.log(
  "part one",
  getPartSum(
    parts.filter(part => part.toolNodes.size >= 1)
  )
)
console.log(
  "part two",
  getGearSum(
    Array
      .from(tools.values())
      .filter(tool => tool.symbol === '*' && tool.adjacentParts.size === 2)
  )
)