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
  output: number[] = [];

  async process(
    instructions: number[], 
    inputs: number[] = []
  ){
    //reset and copy parameters
    this.instructions = instructions.slice(0);
    this.inputs = inputs.slice(0);
    this.inputPosition = 0;
    this.output = [];

    let opcodeIndex = 0;
    while( opcodeIndex < this.instructions.length && this.instructions[opcodeIndex] !== undefined && this.instructions[opcodeIndex] !== 99 ){
      const instruction = this.parseOpcode(this.instructions[opcodeIndex])
      let params: number[];
      let inputValue: number;
      switch(instruction.operation){
        case 1:
          //addition [op, inA, inB, out] => inA+inB into out
          params = [
            this.getParameterValue(instruction.parameterModes[0], this.instructions[opcodeIndex+1]),
            this.getParameterValue(instruction.parameterModes[1], this.instructions[opcodeIndex+2]),
            this.instructions[opcodeIndex+3]
          ]
          console.log(instruction, params)
          this.instructions[params[2]] = params[0] + params[1];
          opcodeIndex += 4;
        break;
        case 2:
          //multiplication [op, inA, inB, out] => inA*inB into out
          params = [
            this.getParameterValue(instruction.parameterModes[0], this.instructions[opcodeIndex+1]),
            this.getParameterValue(instruction.parameterModes[1], this.instructions[opcodeIndex+2]),
            this.instructions[opcodeIndex+3]
          ]
          console.log(instruction, params)
          this.instructions[this.instructions[opcodeIndex+3]] = params[0] * params[1];
          opcodeIndex += 4;
        break;
        case 3:
          //input
          params = [
            this.instructions[opcodeIndex+1]
          ]
          if( this.inputs[this.inputPosition] !== undefined ){
            inputValue = this.inputs[this.inputPosition];
          }
          else{
            inputValue = parseInt(await prompt("Input: "), 10);
          }
          this.inputPosition++;
          console.log(instruction, params)
          this.instructions[params[0]] = inputValue;
          opcodeIndex += 2;
        break;
        case 4:
          //output
          params = [
            this.instructions[opcodeIndex+1]
          ]
          console.log(instruction, params)
          this.output.push(this.instructions[params[0]])
          opcodeIndex += 2;
        break;
        case 5:
          //jumpIfTrue
          params = [
            this.getParameterValue(instruction.parameterModes[0], this.instructions[opcodeIndex+1]),
            this.getParameterValue(instruction.parameterModes[1], this.instructions[opcodeIndex+2])
          ]
          console.log(instruction, [this.instructions[opcodeIndex+1], this.instructions[opcodeIndex+2]], params)
          if( params[0] !== 0 ) opcodeIndex = params[1];
          else opcodeIndex += 3;
          console.log(opcodeIndex)
        break;
        case 6:
          //jumpIfFalse
          params = [
            this.getParameterValue(instruction.parameterModes[0], this.instructions[opcodeIndex+1]),
            this.getParameterValue(instruction.parameterModes[1], this.instructions[opcodeIndex+2])
          ]
          console.log(instruction, params)
          if( params[0] === 0 ) opcodeIndex = params[1];
          else opcodeIndex += 3;
          console.log(opcodeIndex)
        break;
        case 7:
          //SetFlagIfLess
          params = [
            this.getParameterValue(instruction.parameterModes[0], this.instructions[opcodeIndex+1]),
            this.getParameterValue(instruction.parameterModes[1], this.instructions[opcodeIndex+2]),
            this.instructions[opcodeIndex+3]
          ]
          console.log(instruction, params)
          if( params[0] < params[1] ) this.instructions[params[2]] = 1;
          else this.instructions[params[2]] = 0;
          opcodeIndex += 4;
        break;
        case 8:
          //SetFlagIfEqual
          params = [
            this.getParameterValue(instruction.parameterModes[0], this.instructions[opcodeIndex+1]),
            this.getParameterValue(instruction.parameterModes[1], this.instructions[opcodeIndex+2]),
            this.instructions[opcodeIndex+3]
          ]
          console.log(instruction, params)
          if( params[0] === params[1] ) this.instructions[params[2]] = 1;
          else this.instructions[params[2]] = 0;
          opcodeIndex += 4;
        break;
      }
    }

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