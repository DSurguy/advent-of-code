import {createInterface} from 'readline';

async function prompt(message: string = ''): Promise<string>{
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve, reject) => {
    rl.question(message, (response) => {
      rl.close();
      if( response !== '' && response !== undefined && response !== null ){
        resolve(response);
      } else reject();
    })
  })
}

export default class IntcodeProcessor {
  instructions: number[] = [];
  inputs: number[] = [];
  inputPosition: 0;
  output: undefined | number = undefined;

  async process(
    instructions: number[], 
    inputs: number[] = []
  ){
    //reset and copy parameters
    this.instructions = instructions.slice(0);
    this.inputs = inputs.slice(0);
    this.inputPosition = 0;
    this.output = undefined;

    let opcodeIndex = 0;
    while( opcodeIndex < this.instructions.length && this.instructions[opcodeIndex] && this.instructions[opcodeIndex] !== 99 ){
      const instruction = this.parseOpcode(this.instructions[opcodeIndex])
      let params: number[];
      let destination: number;
      let inputValue: number;
      console.log(instruction)
      switch(instruction.operation){
        case 1:
          //addition [op, inA, inB, out] => inA+inB into out
          params = [
            this.getParameterValue(instruction.parameterModes[0], this.instructions[opcodeIndex+1]),
            this.getParameterValue(instruction.parameterModes[1], this.instructions[opcodeIndex+2])
          ]
          destination = this.instructions[opcodeIndex+3];
          this.instructions[destination] = params[0] + params[1];
          opcodeIndex += 4;
        break;
        case 2:
          //multiplication [op, inA, inB, out] => inA*inB into out
          params = [
            this.getParameterValue(instruction.parameterModes[0], this.instructions[opcodeIndex+1]),
            this.getParameterValue(instruction.parameterModes[1], this.instructions[opcodeIndex+2])
          ]
          destination = this.instructions[opcodeIndex+3];
          this.instructions[destination] = params[0] * params[1];
          opcodeIndex += 4;
        break;
        case 3:
          //input
          if( this.inputs[this.inputPosition] !== undefined ){
            inputValue = this.inputs[this.inputPosition];
          }
          else{
            inputValue = parseInt(await prompt("Input: "), 10);
          }
          destination = this.instructions[opcodeIndex+1];
          this.instructions[destination] = inputValue;
          opcodeIndex += 2;
        break;
        case 4:
          //output
          const target = this.instructions[opcodeIndex+1];
          console.log(`Output: ${this.instructions[target]}`);
          opcodeIndex += 2;
        break;
      }
    }

    this.output = this.instructions[0];
    return this.output;
  }

  parseOpcode(opcode: number | string): {
    operation: number;
    parameterModes: number[];
  } {
    let splitCode = opcode.toString().split('');
    const operation = parseInt(splitCode.slice(-2).join(''), 10);

    splitCode = splitCode.reverse();
    const parameterModes: number[] = [];
    for( let i=2; i<5; i++ ){
      parameterModes.push(parseInt(splitCode[i]||'0', 10))
    }
    console.log(opcode, operation, parameterModes);
    return {
      operation,
      parameterModes
    }
  }

  getParameterValue(mode, param){
    if( mode === 1 ){
      //immediate mode
      return param;
    }
    else{
      //position mode
      return this.instructions[param]
    }
  }
}