import React from 'react';
// import { MarkerType, Position } from 'reactflow';

export const nodes = [
  {
    id: '1',
    data: {
      label: 'class: Thompson Sampling',
    },
    className: 'ts-class',
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    data: {
      label: 'class: BernoulliBandit',
    },
    className: 'bb-class',
    position: { x: 200, y: 100 },
  },
  {
    id: '1a',
    data: {
      label: 'init',
    },
    position: { x: 400, y: 100 },
  }
];

export const edges = [
  { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];
