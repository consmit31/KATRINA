import React, { useState, useCallback, useEffect } from 'react';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

type GameState = 'playing' | 'won' | 'lost';

function MinesweeperToolContent() {
  const [rows, setRows] = useState(12);
  const [cols, setCols] = useState(12);
  const [mines, setMines] = useState(20);
  const [noGuessingMode, setNoGuessingMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [flagCount, setFlagCount] = useState(mines);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize empty board
  const initializeBoard = useCallback(() => {
    const newBoard: Cell[][] = [];
    for (let row = 0; row < rows; row++) {
      newBoard[row] = [];
      for (let col = 0; col < cols; col++) {
        newBoard[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        };
      }
    }
    return newBoard;
  }, [rows, cols]);

  // Simple solver to check if puzzle is solvable without guessing
  const canSolvePuzzle = useCallback((board: Cell[][], startRow: number, startCol: number) => {
    if (!noGuessingMode) return true; // Skip validation if not in no-guessing mode
    
    const testBoard = board.map(row => row.map(cell => ({ ...cell, isRevealed: false, isFlagged: false })));
    testBoard[startRow][startCol].isRevealed = true;
    
    // Simple solver - keep revealing cells that can be logically deduced
    let changed = true;
    let iterations = 0;
    const maxIterations = rows * cols;
    
    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (!testBoard[row][col].isRevealed || testBoard[row][col].isMine) continue;
          
          const neighbors = [];
          let hiddenCount = 0;
          let flaggedCount = 0;
          
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && (newRow !== row || newCol !== col)) {
                neighbors.push({ row: newRow, col: newCol });
                if (!testBoard[newRow][newCol].isRevealed) {
                  if (testBoard[newRow][newCol].isFlagged) flaggedCount++;
                  else hiddenCount++;
                }
              }
            }
          }
          
          // If all mines around this cell are flagged, reveal remaining neighbors
          if (flaggedCount === testBoard[row][col].neighborMines) {
            for (const {row: nRow, col: nCol} of neighbors) {
              if (!testBoard[nRow][nCol].isRevealed && !testBoard[nRow][nCol].isFlagged) {
                testBoard[nRow][nCol].isRevealed = true;
                changed = true;
              }
            }
          }
          
          // If remaining hidden cells equal remaining mines, flag them
          if (hiddenCount + flaggedCount === testBoard[row][col].neighborMines) {
            for (const {row: nRow, col: nCol} of neighbors) {
              if (!testBoard[nRow][nCol].isRevealed && !testBoard[nRow][nCol].isFlagged) {
                testBoard[nRow][nCol].isFlagged = true;
                flaggedCount++;
                hiddenCount--;
                changed = true;
              }
            }
          }
        }
      }
    }
    
    // Check if we can solve the puzzle (all non-mines revealed)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!testBoard[row][col].isMine && !testBoard[row][col].isRevealed) {
          return false;
        }
      }
    }
    
    return true;
  }, [noGuessingMode, rows, cols]);

  // Place mines with optional no-guessing validation
  const placeMines = useCallback((board: Cell[][], firstClickRow: number, firstClickCol: number) => {
    let attempts = 0;
    const maxAttempts = noGuessingMode ? 100 : 1;
    
    while (attempts < maxAttempts) {
      let minesPlaced = 0;
      const newBoard = board.map(row => row.map(cell => ({ ...cell, isMine: false })));

      while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        
        // Don't place mine on first click, adjacent to first click, or if already has mine
        const isAdjacent = Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1;
        if (!newBoard[row][col].isMine && !isAdjacent) {
          newBoard[row][col].isMine = true;
          minesPlaced++;
        }
      }
      
      // Calculate neighbor mines for this configuration
      const boardWithNeighbors = calculateNeighborMines(newBoard);
      
      // Check if this configuration is solvable
      if (canSolvePuzzle(boardWithNeighbors, firstClickRow, firstClickCol)) {
        return boardWithNeighbors;
      }
      
      attempts++;
    }
    
    // Fallback: if we can't find a no-guessing solution, place mines normally
    let minesPlaced = 0;
    const newBoard = board.map(row => row.map(cell => ({ ...cell, isMine: false })));

    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      const isAdjacent = Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1;
      if (!newBoard[row][col].isMine && !isAdjacent) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    return calculateNeighborMines(newBoard);
  }, [mines, rows, cols, noGuessingMode, canSolvePuzzle]);

  // Calculate neighbor mines
  const calculateNeighborMines = useCallback((board: Cell[][]) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (newBoard[newRow][newCol].isMine) {
                  count++;
                }
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    return newBoard;
  }, [rows, cols]);

  // Initialize game
  const initializeGame = useCallback(() => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setGameState('playing');
    setFlagCount(mines);
    setTimer(0);
    setGameStarted(false);
    setShowConfetti(false);
  }, [initializeBoard, mines]);

  // Reveal cell and adjacent empty cells
  const revealCell = useCallback((board: Cell[][], row: number, col: number): Cell[][] => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    if (row < 0 || row >= rows || col < 0 || col >= cols || 
        newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) {
      return newBoard;
    }

    newBoard[row][col].isRevealed = true;

    // If it's an empty cell (no neighboring mines), reveal adjacent cells
    if (newBoard[row][col].neighborMines === 0 && !newBoard[row][col].isMine) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (newRow !== row || newCol !== col) {
            const updatedBoard = revealCell(newBoard, newRow, newCol);
            Object.assign(newBoard, updatedBoard);
          }
        }
      }
    }

    return newBoard;
  }, [rows, cols]);

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState !== 'playing' || board[row][col].isFlagged) {
      return;
    }

    let newBoard = [...board];

    // If clicking on an already revealed cell, try chord clicking
    if (board[row][col].isRevealed && board[row][col].neighborMines > 0) {
      // Count flagged adjacent cells
      let flaggedCount = 0;
      const adjacentCells: {row: number, col: number}[] = [];
      
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && 
              (newRow !== row || newCol !== col)) {
            adjacentCells.push({row: newRow, col: newCol});
            if (newBoard[newRow][newCol].isFlagged) {
              flaggedCount++;
            }
          }
        }
      }

      // If flagged count matches the number on the cell, reveal all unflagged adjacent cells
      if (flaggedCount === board[row][col].neighborMines) {
        let hitMine = false;
        
        for (const {row: adjRow, col: adjCol} of adjacentCells) {
          if (!newBoard[adjRow][adjCol].isFlagged && !newBoard[adjRow][adjCol].isRevealed) {
            newBoard = revealCell(newBoard, adjRow, adjCol);
            if (newBoard[adjRow][adjCol].isMine) {
              hitMine = true;
            }
          }
        }

        if (hitMine) {
          // Reveal all mines
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              if (newBoard[i][j].isMine) {
                newBoard[i][j].isRevealed = true;
              }
            }
          }
          setGameState('lost');
        } else {
          // Check win condition for chord clicking
          let unrevealedCount = 0;
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              if (!newBoard[i][j].isRevealed && !newBoard[i][j].isMine) {
                unrevealedCount++;
              }
            }
          }
          
          if (unrevealedCount === 0 && gameState === 'playing') {
            setGameState('won');
            setShowConfetti(true);
            // Hide confetti after 3 seconds
            setTimeout(() => setShowConfetti(false), 3000);
          }
        }
      }
      
      setBoard(newBoard);
      return;
    }

    // Normal click on unrevealed cell
    if (board[row][col].isRevealed) {
      return;
    }

    // First click - place mines
    if (!gameStarted) {
      newBoard = placeMines(newBoard, row, col);
      setGameStarted(true);
    }

    // Reveal the cell
    newBoard = revealCell(newBoard, row, col);

    // Check if clicked on mine
    if (newBoard[row][col].isMine) {
      // Reveal all mines
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (newBoard[i][j].isMine) {
            newBoard[i][j].isRevealed = true;
          }
        }
      }
      setGameState('lost');
    }

    // Check if won before setting board state
    let unrevealedCount = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newBoard[i][j].isRevealed && !newBoard[i][j].isMine) {
          unrevealedCount++;
        }
      }
    }
    
    setBoard(newBoard);
    
    // Check win condition
    if (unrevealedCount === 0 && gameState === 'playing') {
      setGameState('won');
      setShowConfetti(true);
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [board, gameState, gameStarted, placeMines, calculateNeighborMines, revealCell]);

  // Handle right click (flag)
  const handleRightClick = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (gameState !== 'playing' || board[row][col].isRevealed) {
      return;
    }

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    if (newBoard[row][col].isFlagged) {
      newBoard[row][col].isFlagged = false;
      setFlagCount(prev => prev + 1);
    } else {
      newBoard[row][col].isFlagged = true;
      setFlagCount(prev => prev - 1);
    }

    setBoard(newBoard);
  }, [board, gameState]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (gameStarted && gameState === 'playing') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameState]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Keyboard event listener for Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (gameState === 'won' || gameState === 'lost')) {
        initializeGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, initializeGame]);

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) {
      return '🚩';
    }
    if (!cell.isRevealed) {
      return '';
    }
    if (cell.isMine) {
      return '💣';
    }
    if (cell.neighborMines > 0) {
      return cell.neighborMines.toString();
    }
    return '';
  };

  const getCellStyle = (cell: Cell) => {
    const baseStyle = 'w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer select-none';
    
    if (cell.isFlagged) {
      return `${baseStyle} bg-gray-300 border-t-2 border-l-2 border-r-2 border-b-2 border-t-white border-l-white border-r-gray-500 border-b-gray-500`;
    }
    if (!cell.isRevealed) {
      return `${baseStyle} bg-gray-300 hover:bg-gray-200 border-t-2 border-l-2 border-r-2 border-b-2 border-t-white border-l-white border-r-gray-500 border-b-gray-500`;
    }
    if (cell.isMine) {
      return `${baseStyle} bg-red-600 text-white border border-gray-400`;
    }
    
    const numberColors: { [key: number]: string } = {
      1: 'text-blue-700',
      2: 'text-green-700',
      3: 'text-red-700',
      4: 'text-blue-900',
      5: 'text-red-900',
      6: 'text-teal-700',
      7: 'text-black',
      8: 'text-gray-700',
    };
    
    return `${baseStyle} bg-gray-200 border border-gray-400 border-inset ${numberColors[cell.neighborMines] || ''}`;
  };

  return (
    <div className="flex flex-col items-center p-4 relative" style={{ fontFamily: 'monospace, Courier New' }}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className={`absolute animate-bounce opacity-80`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                fontSize: '20px',
                top: '-20px',
                animation: `confetti-fall ${2 + Math.random() * 3}s linear infinite`,
              }}
            >
              {['🎉', '🎊', '✨', '🌟', '💫', '🎈'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="mb-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="text-lg font-semibold">
            Flags: {flagCount}
          </div>
          <div className="text-lg font-semibold">
            Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </div>
          <button
            onClick={initializeGame}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            New Game
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {showSettings ? 'Hide Settings' : 'Settings'}
          </button>
        </div>
        
        {showSettings && (
          <div className=" p-4 rounded border bg-card" style={{ fontFamily: 'monospace, Courier New' }}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold mb-1">Rows (5-30):</label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={rows}
                  onChange={(e) => setRows(Math.max(5, Math.min(30, parseInt(e.target.value) || 5)))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Columns (5-30):</label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={cols}
                  onChange={(e) => setCols(Math.max(5, Math.min(30, parseInt(e.target.value) || 5)))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">Mines (1-{Math.floor(rows * cols * 0.4)}):</label>
              <input
                type="number"
                min="1"
                max={Math.floor(rows * cols * 0.4)}
                value={mines}
                onChange={(e) => setMines(Math.max(1, Math.min(Math.floor(rows * cols * 0.4), parseInt(e.target.value) || 1)))}
                className="w-full px-2 py-1 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={noGuessingMode}
                  onChange={(e) => setNoGuessingMode(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-bold">No Guessing Mode</span>
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Ensures the puzzle is solvable through logic alone (may take longer to generate)
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Presets:</strong></p>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => { setRows(9); setCols(9); setMines(10); }}
                  className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                >
                  Beginner (9×9, 10)
                </button>
                <button
                  onClick={() => { setRows(16); setCols(16); setMines(40); }}
                  className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                >
                  Intermediate (16×16, 40)
                </button>
                <button
                  onClick={() => { setRows(16); setCols(30); setMines(99); }}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Expert (16×30, 99)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {gameState === 'won' && (
        <div className="mb-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            🎉 CONGRATULATIONS! 🎉
          </div>
          <div className="text-lg text-green-700">
            You cleared the minefield in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}!
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Press Enter or click "New Game" to play again
          </div>
        </div>
      )}
      
      {gameState === 'lost' && (
        <div className="mb-4 text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">
            💥 Game Over 💥
          </div>
          <div className="text-sm text-gray-600">
            Press Enter or click "New Game" to try again
          </div>
        </div>
      )}

      <div 
        className="grid gap-0 border-4 border-t-gray-500 border-l-gray-500 border-r-white border-b-white p-2 bg-gray-300"
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          // Prevent default if clicking on grid background (spaces between squares)
          if (e.target === e.currentTarget) {
            e.preventDefault();
          }
        }}
        style={{
          fontFamily: 'monospace'
        }}
      >
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <button
                key={colIndex}
                className={getCellStyle(cell)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRightClick(e, rowIndex, colIndex);
                }}
                onMouseDown={(e) => {
                  // Prevent text selection and improve responsiveness
                  e.preventDefault();
                }}
                disabled={gameState !== 'playing'}
                style={{ 
                  minWidth: '32px', 
                  minHeight: '32px',
                  fontFamily: 'monospace, Courier New',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {getCellContent(cell)}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-600 max-w-md text-center">
        <p><strong>Instructions:</strong></p>
        <p>Left click to reveal cells. Right click to flag/unflag potential mines.</p>
        <p>Click on a revealed number to auto-reveal adjacent cells if you've flagged the correct number of mines around it.</p>
        <p>Numbers show how many mines are adjacent to that cell.</p>
        <p>Find all cells without mines to win!</p>
      </div>
    </div>
  );
}

export default MinesweeperToolContent;