import React, { useState, useEffect } from 'react';
import Node from './Node/Node';
import './PathfindingVisualizer.css';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';

// Default Positions
let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  // NEW: Which mode user is in? ("start", "finish", null)
  const [placingMode, setPlacingMode] = useState(null);

  // Initialize grid once
  useEffect(() => {
    setGrid(getInitialGrid());
  }, []);

  /* -----------------------------------------------------
      Mouse Down (now supports placing start/finish)
  ------------------------------------------------------ */
  const handleMouseDown = (row, col) => {
    // Placing START node
    if (placingMode === "start") {
      setGrid(prev => changeStartNode(prev, row, col));
      START_NODE_ROW = row;
      START_NODE_COL = col;
      setPlacingMode(null);
      return;
    }

    // Placing FINISH node
    if (placingMode === "finish") {
      setGrid(prev => changeFinishNode(prev, row, col));
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
      setPlacingMode(null);
      return;
    }

    // Otherwise toggle wall
    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => setMouseIsPressed(false);

  /* -----------------------------------------------------
      Animation – Visited Nodes
  ------------------------------------------------------ */
  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const elem = document.getElementById(`node-${node.row}-${node.col}`);
        if (elem) elem.classList.add("node-visited");
      }, 10 * i);
    }
  };

  /* -----------------------------------------------------
      Animation – Shortest Path
  ------------------------------------------------------ */
  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const elem = document.getElementById(`node-${node.row}-${node.col}`);
        if (elem) elem.classList.add("node-shortest-path");
      }, 40 * i);
    }
  };

  /* -----------------------------------------------------
      Run Dijkstra
  ------------------------------------------------------ */
 const visualizeDijkstra = () => {

  // 🔥 Pulse the background to show algorithm is running
  const app = document.querySelector(".app-container");
  if (app) {
    app.classList.add("algorithm-active");
    setTimeout(() => {
      app.classList.remove("algorithm-active");
    }, 2000);
  }

  const startNode = grid[START_NODE_ROW][START_NODE_COL];
  const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

  const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
};


  /* -----------------------------------------------------
      UI + Grid Rendering
  ------------------------------------------------------ */
  return (
    <div className="pathfinder-container">

      <button className="btn" onClick={visualizeDijkstra}>
        Visualize Dijkstra
      </button>

      <button className="btn" onClick={() => setPlacingMode("start")}>
        Place Start Node
      </button>

      <button className="btn" onClick={() => setPlacingMode("finish")}>
        Place Finish Node
      </button>

      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((node, nodeIdx) => (
              <Node
                key={nodeIdx}
                {...node}
                onMouseDown={(r, c) => handleMouseDown(r, c)}
                onMouseEnter={(r, c) => handleMouseEnter(r, c)}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* -----------------------------------------------------
    Grid Helpers
------------------------------------------------------ */
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => ({
  col,
  row,
  isStart: row === START_NODE_ROW && col === START_NODE_COL,
  isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
  distance: Infinity,
  isVisited: false,
  isWall: false,
  previousNode: null,
});

/* -----------------------------------------------------
    NEW — Change Start Node
------------------------------------------------------ */
const changeStartNode = (grid, row, col) => {
  const newGrid = grid.map(r => r.map(n => ({ ...n })));

  // remove old start
  newGrid.forEach(r => r.forEach(n => (n.isStart = false)));

  // assign new start
  newGrid[row][col].isStart = true;

  return newGrid;
};

/* -----------------------------------------------------
    NEW — Change Finish Node
------------------------------------------------------ */
const changeFinishNode = (grid, row, col) => {
  const newGrid = grid.map(r => r.map(n => ({ ...n })));

  // remove old finish
  newGrid.forEach(r => r.forEach(n => (n.isFinish = false)));

  // assign new finish
  newGrid[row][col].isFinish = true;

  return newGrid;
};

/* -----------------------------------------------------
    Wall Toggle
------------------------------------------------------ */
const toggleWall = (grid, row, col) => {
  const newGrid = grid.map(r => r.slice());
  const node = newGrid[row][col];

  if (node.isStart || node.isFinish) return newGrid;

  newGrid[row][col] = { ...node, isWall: !node.isWall };

  return newGrid;
};

export default PathfindingVisualizer;
