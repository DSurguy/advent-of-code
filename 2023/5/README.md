# Mock Answers
- Part One: 35
  - Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
  - Seed 14, soil 14, fertilizer 53, water 49, light 42, temperature 42, humidity 43, location 43.
  - Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.
  - Seed 13, soil 13, fertilizer 52, water 41, light 34, temperature 34, humidity 35, location 35.

# Real Answers
- Part One: 26273516

# Notes
- I solved the mock with a naive solution of actually iterating over the ranges. This works great for the mock, and allows for debugging. Unfortunately, this is also insanely slow AND memory intensive, and immediately fell over when I ran it against the real input. Going to have to just use simple math for the real solution.
- Also I need to learn a bit of bigint, so I'll use that for the proper solution to part one.