export const SORT_DESCRIPTIONS = {
  quick: {
    summary: "Uses a divide-and-conquer approach, partitioning the array around a pivot.",
    complexity: "Average O(n log n), Worst O(n²)",
    stable: "Unstable",
    notes: "Performance depends on implementation and pivot selection. Very fast on average.",
  },
  merge: {
    summary: "Divides the array and sorts it by merging sorted subarrays.",
    complexity: "O(n log n)",
    stable: "Stable",
    notes: "Requires extra memory. Consistently fast for large datasets.",
  },
  selection: {
    summary: "Selects the minimum (or maximum) element and places it in order from the front.",
    complexity: "O(n²)",
    stable: "Unstable (depends on implementation)",
    notes: "Few swaps but many comparisons.",
  },
  gnome: {
    summary: "Sorts by moving elements backward and forward (Gnome sort).",
    complexity: "Average O(n²)",
    stable: "Stable (depends on implementation)",
    notes: "Simple but inefficient for large arrays.",
  },
  bubble: {
    summary: "Repeatedly compares adjacent elements and pushes the largest value to the end.",
    complexity: "O(n²) (Best O(n))",
    stable: "Stable",
    notes: "Good for educational purposes. Not suitable for large arrays.",
  },
  insertion: {
    summary: "Builds the sorted array one element at a time, like arranging cards in hand.",
    complexity: "Average O(n²) (Best O(n))",
    stable: "Stable",
    notes: "Performs very well on nearly sorted data.",
  },
};
