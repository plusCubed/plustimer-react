export default {
  puzzles: [
    {
      id: 1,
      name: '3×3×3',
      categories: [1, 2, 3, 4, 5, 6]
    },
    {
      id: 2,
      name: '4×4×4',
      categories: [7, 8]
    },
    {
      id: 3,
      name: '5×5×5',
      categories: [9, 10]
    },
    {
      id: 4,
      name: '2×2×2',
      categories: [11]
    },
    {
      id: 5,
      name: 'Megaminx',
      categories: [12]
    },
    {
      id: 6,
      name: 'Pyraminx',
      categories: [13]
    },
    {
      id: 7,
      name: 'Square-1',
      categories: [14]
    },
    {
      id: 8,
      name: 'Clock',
      categories: [15]
    },
    {
      id: 9,
      name: 'Skewb',
      categories: [16]
    },
    {
      id: 10,
      name: '6×6×6',
      categories: [17]
    },
    {
      id: 11,
      name: '7×7×7',
      categories: [18]
    }
  ],
  categories: [
    // 3x3x3
    {
      id: 1,
      puzzleId: 1,
      name: 'Normal',
      scrambler: '333'
    },
    {
      id: 2,
      puzzleId: 1,
      name: 'OH',
      scrambler: '333'
    },
    {
      id: 3,
      puzzleId: 1,
      name: 'Feet',
      scrambler: '333'
    },
    {
      id: 4,
      puzzleId: 1,
      name: 'BLD',
      scrambler: '333bf'
    },
    {
      id: 5,
      puzzleId: 1,
      name: 'FMC',
      scrambler: '333fm'
    },
    {
      id: 6,
      puzzleId: 1,
      name: 'MBLD',
      scrambler: '333mbf'
    },
    // 4x4x4
    {
      id: 7,
      puzzleId: 2,
      name: 'Normal',
      scrambler: '444'
    },
    {
      id: 8,
      puzzleId: 2,
      name: 'BLD',
      scrambler: '444bf'
    },
    // 5x5x5
    {
      id: 9,
      puzzleId: 3,
      name: 'Normal',
      scrambler: '555'
    },
    {
      id: 10,
      puzzleId: 3,
      name: 'BLD',
      scrambler: '555bf'
    },
    // 2x2x2
    {
      id: 11,
      puzzleId: 4,
      name: 'Normal',
      scrambler: '222'
    },
    // Megaminx
    {
      id: 12,
      puzzleId: 5,
      name: 'Normal',
      scrambler: 'minx'
    },
    // Pyraminx
    {
      id: 13,
      puzzleId: 6,
      name: 'Normal',
      scrambler: 'pyram'
    },
    // SQ1
    {
      id: 14,
      puzzleId: 7,
      name: 'Normal',
      scrambler: 'sq1'
    },
    // Clock
    {
      id: 15,
      puzzleId: 8,
      name: 'Normal',
      scrambler: 'clock'
    },
    // Skewb
    {
      id: 16,
      puzzleId: 9,
      name: 'Normal',
      scrambler: 'skewb'
    },
    // 6x6x6
    {
      id: 17,
      puzzleId: 10,
      name: 'Normal',
      scrambler: '666'
    },
    // 7x7x7
    {
      id: 18,
      puzzleId: 11,
      name: 'Normal',
      scrambler: '777'
    }
  ]
};
