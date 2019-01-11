import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Board from './Board';

let knightPosition = [1, 7];
let observer = null;

class Game extends Component {

  render() {
    return (
      <div>
        <Board knightPosition={knightPosition} />
      </div>
    );
  }
}

function emitChange() {
  observer(knightPosition);
}

export default Game;

export function observe(o) {
  if (observer) {
    throw new Error('Multiple observers not implemented.');
  }

  observer = o;
  emitChange();
}


export function moveKnight(toX, toY) {
  knightPosition = [toX, toY];
  emitChange();
}

export function canMoveKnight(toX, toY) {
  const [x, y] = knightPosition;
  const dx = toX - x;
  const dy = toY - y;

  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}
