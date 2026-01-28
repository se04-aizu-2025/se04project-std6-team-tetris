export const SORT_DESCRIPTIONS = {
  quick: {
    id: "quick",
    title: "Quick Sort",
    summary:
      "Quick Sort chooses a pivot value and partitions the array into elements smaller than the pivot and elements larger than the pivot. It then recursively sorts each partition. It is one of the most popular sorting algorithms because it is usually very fast on average.",
    howItWorks: [
      "Choose a pivot (reference value) from the array",
      "Partition the array into elements smaller than the pivot and elements larger than the pivot",
      "Recursively sort the left and right partitions using the same method",
      "Stop when a partition has 1 or 0 elements",
    ],
    complexity: {
      timeAverage: "O(n log n)",
      timeWorst: "O(n^2) (depends on the pivot choice)",
      space: "O(log n) (typical, due to recursion)",
      stable: "Unstable",
    },
    goodFor: ["Very fast on average", "Uses relatively little extra memory"],
    notGoodFor: ["Worst case can become O(n^2)", "Not a stable sort"],
  },

  merge: {
    id: "merge",
    title: "Merge Sort",
    summary:
      "Merge Sort repeatedly divides the array into halves (divide) and then merges (merge) the sorted halves back together. It guarantees O(n log n) time and is stable, which makes it a reliable choice.",
    howItWorks: [
      "Divide the array into two halves",
      "Keep dividing each half until each subarray has 1 element",
      "Merge subarrays back together while maintaining sorted order",
      "Continue until the entire array is merged into a sorted array",
    ],
    complexity: {
      timeAverage: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(n)",
      stable: "Stable",
    },
    goodFor: ["Guaranteed fast worst case", "Stable sort", "Good for external sorting (large data)"],
    notGoodFor: ["Requires extra memory (O(n))"],
  },

  heap: {
    id: "heap",
    title: "Heap Sort",
    summary:
      "Heap Sort uses a heap data structure to efficiently extract the maximum (or minimum) element and place it into its correct position. It guarantees O(n log n) time even in the worst case and uses very little extra memory.",
    howItWorks: [
      "Build a heap (max-heap or min-heap) from the array",
      "Swap the root (max/min) with the last element to place it in its final position",
      "Reduce the heap size by one and restore the heap property (heapify)",
      "Repeat until the array is fully sorted",
    ],
    complexity: {
      timeAverage: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(1)",
      stable: "Unstable",
    },
    goodFor: ["Guaranteed O(n log n) worst case", "Almost no extra memory needed"],
    notGoodFor: ["Not a stable sort", "Implementation can be slightly complex"],
  },

  gnome: {
    id: "gnome",
    title: "Gnome Sort",
    summary:
      "Gnome Sort compares adjacent elements. If they are in the correct order, it moves forward; if not, it swaps them and moves one step back. It is intuitive to visualize and is similar in spirit to Insertion Sort.",
    howItWorks: [
      "Compare the current element with the previous element",
      "If the order is correct, move one step forward",
      "If the order is incorrect, swap them and move one step back (or move forward if you cannot move back)",
      "Finish when you reach the end of the array",
    ],
    complexity: {
      timeAverage: "O(n^2)",
      timeWorst: "O(n^2)",
      space: "O(1)",
      stable: "Stable",
    },
    goodFor: ["Simple to implement and visualize", "Easy to understand for small datasets"],
    notGoodFor: ["Not suitable for large datasets (quadratic time)"],
  },

  insertion: {
    id: "insertion",
    title: "Insertion Sort",
    summary:
      "Insertion Sort treats the left side of the array as sorted, then takes one element from the right and inserts it into the correct position in the sorted part. It performs very well when the data is already nearly sorted.",
    howItWorks: [
      "Take elements one by one from left to right and insert each into the sorted portion on the left",
      "Shift elements to the right as needed to make space",
      "Repeat for the next element",
      "Finish when all elements have been processed",
    ],
    complexity: {
      timeAverage: "O(n^2)",
      timeWorst: "O(n^2)",
      space: "O(1)",
      stable: "Stable",
    },
    goodFor: ["Fast for nearly sorted data (best case O(n))", "No extra memory needed", "Stable sort"],
    notGoodFor: ["Slow for large random datasets (O(n^2))"],
  },

  bubble: {
    id: "bubble",
    title: "Bubble Sort",
    summary:
      "Bubble Sort repeatedly compares adjacent elements and swaps them if they are in the wrong order. With each pass, the largest (or smallest) value “bubbles” to the end of the array. It is easy to learn and visualize.",
    howItWorks: [
      "Compare each pair of adjacent elements from left to right",
      "Swap them if they are in the wrong order",
      "After one full pass, the largest (or smallest) element is placed at the end",
      "Repeat on the remaining unsorted portion until fully sorted",
    ],
    complexity: {
      timeAverage: "O(n^2)",
      timeWorst: "O(n^2)",
      space: "O(1)",
      stable: "Stable",
    },
    goodFor: ["Very easy to implement", "Great for learning and visualization"],
    notGoodFor: ["Too slow for large datasets (quadratic time)"],
  },
};
