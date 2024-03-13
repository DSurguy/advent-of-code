import { parseArgs } from "util";

type Args = {
  mock?: boolean;
}
export function getParsedArgs (): Args {
  const { values: rawArgv } = parseArgs({
    args: Bun.argv,
    options: {
      mock: {
        type: 'boolean',
        alias: 'm'
      }
    },
    allowPositionals: true
  })
  const convert: Record<keyof Args, Function> = {
    mock: (v?: boolean): boolean => !!v
  }
  Object.entries(convert).forEach(([key, fn]) => {
    let typedKey = key as keyof Args;
    if( rawArgv[typedKey] ){
      rawArgv[typedKey] = fn(rawArgv[typedKey]);
    }
  })
  return rawArgv as Args;
}