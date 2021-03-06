import { COORDINATE_SYSTEM } from 'deck.gl';
import { interpolatePlasma } from 'd3-scale-chromatic';

export function makeCellStatusMessage(cellInfoFactors) {
  return Object.entries(cellInfoFactors).map(
    ([factor, value]) => `${factor}: ${value}`,
  ).join('; ');
}

export function cellLayerDefaultProps(cells, updateStatus, updateCellsHover, uuid) {
  return {
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    data: cells,
    pickable: true,
    autoHighlight: true,
    stroked: true,
    filled: true,
    getElevation: 0,
    getLineWidth: 0,
    onHover: (info) => {
      if (info.object) {
        const [cellId, cellInfo] = info.object;
        const { factors = {}, xy, mappings = {} } = cellInfo;
        updateStatus(makeCellStatusMessage(factors));
        updateCellsHover({
          cellId,
          mappings: { xy, ...mappings },
          uuid,
          factors,
        });
      } else {
        // Clear the currently-hovered cell info by passing null.
        updateCellsHover(null);
      }
    },
  };
}

export const DEFAULT_COLOR = [128, 128, 128];

// From https://personal.sron.nl/~pault/#sec:qualitative
export const PALETTE = [
  [68, 119, 170],
  [136, 204, 238],
  [68, 170, 153],
  [17, 119, 51],
  [153, 153, 51],
  [221, 204, 119],
  [204, 102, 119],
  [136, 34, 85],
  [170, 68, 153],
];

export const VIEWER_PALETTE = [
  [0, 0, 255],
  [0, 255, 0],
  [255, 0, 0],
  [255, 255, 0],
  [0, 255, 255],
  [255, 0, 255],
  [255, 255, 255],
  [255, 128, 0],
];


export function rgb(hexString) {
  return [
    parseInt(hexString.slice(1, 3), 16),
    parseInt(hexString.slice(3, 5), 16),
    parseInt(hexString.slice(5, 7), 16),
  ];
}

export function interpolateColors(zeroToOne) {
  // The lowest 25% does not have good contrast.
  return rgb((interpolatePlasma(zeroToOne / 0.75 + 0.25)));
}

// Adapted from https://github.com/feross/fromentries/blob/29b52a850bb3a47c390937631c2638edf3443942/index.js
export function fromEntries(iterable) {
  return [...iterable]
    .reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {});
}

export function range(length) {
  return [...Array(length).keys()];
}

export const COLORMAP_OPTIONS = [
  'viridis',
  'greys',
  'magma',
  'jet',
  'hot',
  'bone',
  'copper',
  'summer',
  'density',
  'inferno',
];

export const DEFAULT_GL_OPTIONS = { webgl2: true };

export function createDefaultUpdateStatus(componentName) {
  return message => console.warn(`${componentName} updateStatus: ${message}`);
}

export function createDefaultUpdateCellsSelection(componentName) {
  return cellsSelection => console.warn(`${componentName} updateCellsSelection: ${cellsSelection}`);
}

export function createDefaultUpdateCellsHover(componentName) {
  return hoverInfo => console.warn(`${componentName} updateCellsHover: ${hoverInfo.cellId}`);
}

export function createDefaultUpdateViewInfo(componentName) {
  return viewInfo => console.warn(`${componentName} updateViewInfo: ${viewInfo}`);
}

export function createDefaultClearPleaseWait(componentName) {
  return layer => console.warn(`${componentName} "clearPleaseWait" not provided; layer: ${layer}`);
}
