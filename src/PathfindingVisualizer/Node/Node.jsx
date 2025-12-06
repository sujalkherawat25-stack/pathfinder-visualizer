import React from 'react';
import './Node.css';

const Node = ({ 
  isStart, 
  isFinish, 
  isWall, 
  row, 
  col, 
  onMouseDown, 
  onMouseEnter, 
  onMouseUp 
}) => {

  // Determine the base class
  const extraClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall
    ? 'node-wall'
    : '';

  return (
    <div
      id={`node-${row}-${col}`}     // 🔥 REQUIRED for animations to target this div
      className={`node ${extraClassName}`}   // 🔥 Base + special classes (start/finish/wall)
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    ></div>
  );
};

export default Node;
