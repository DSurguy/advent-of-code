# Intcode Processor

## Instructions
- 1: Addition
  - `0 + 1 -> 2`
- 2: Multiplication
  - `0 * 1 -> 2`
- 3: Input
  - `-> 0`
- 4: Output
  - `0 -> out`
- 5: Jump If True
  - `0 !== [0] ? goto 1`
- 6: Jump If False
  - `0 === [0] ? goto 1`
- 7: Set Flag If Less
  - `0 < 1 ? [1] -> 2 : [0] -> 2`
- 8: Set Flag If Equal
  - `0 === 1 ? [1] -> 2 : [0] -> 2`