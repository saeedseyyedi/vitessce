import { COORDINATE_SYSTEM } from 'deck.gl';
import SelectionLayer from './SelectionLayer';

/**
 * Convert a DeckGL layer ID to a "base" layer ID for selection.
 * @param {string} layerId The layer ID to convert.
 * @returns {string} The base layer ID.
 */
function getBaseLayerId(layerId) {
  return `base-${layerId}`;
}

/**
 * Convert a DeckGL layer ID to a "selected" layer ID for selection.
 * @param {string} layerId The layer ID to convert.
 * @returns {string} The base layer ID.
 */
function getSelectedLayerId(layerId) {
  return `selected-${layerId}`;
}

/**
 * Construct DeckGL selection layers.
 * @param {string} tool
 * @param {number} zoom
 * @param {string} cellBaseLayerId
 * @param {function} getCellCoords
 * @param {function} updateCellsSelection
 * @returns {object[]} The array of DeckGL selection layers.
 */
export function getSelectionLayers(
  tool,
  zoom,
  layerId,
  getCellCoords,
  updateCellsSelection,
) {
  if (!tool) {
    return [];
  }

  const cellBaseLayerId = getBaseLayerId(layerId);
  const editHandlePointRadius = 5 / (zoom + 16);

  return [new SelectionLayer({
    id: 'selection',
    getCellCoords,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    selectionType: tool,
    onSelect: ({ pickingInfos }) => {
      const cellIds = new Set(pickingInfos.map(cellObj => cellObj.object[0]));
      updateCellsSelection(cellIds);
    },
    layerIds: [cellBaseLayerId],
    getTentativeFillColor: () => [255, 255, 255, 95],
    getTentativeLineColor: () => [143, 143, 143, 255],
    getTentativeLineDashArray: () => [7, 4],
    lineWidthMinPixels: 2,
    lineWidthMaxPixels: 2,
    getEditHandlePointColor: () => [0xff, 0xff, 0xff, 0xff],
    getEditHandlePointRadius: () => editHandlePointRadius,
    editHandlePointRadiusScale: 1,
    editHandlePointRadiusMinPixels: editHandlePointRadius,
    editHandlePointRadiusMaxPixels: 2 * editHandlePointRadius,
  })];
}

/**
 * Get deck.gl layer props for selection overlays.
 * @param {object} props
 * @returns {object} Object with two properties,
 * overlay: overlayProps, base: baseProps,
 * where the values are deck.gl layer props.
 */
export function overlayBaseProps(props) {
  const {
    id, getColor, data, isSelected, ...rest
  } = props;
  return {
    overlay: {
      id: getSelectedLayerId(id),
      getFillColor: getColor,
      getLineColor: getColor,
      data: data.filter(isSelected),
      ...rest,
    },
    base: {
      id: getBaseLayerId(id),
      getLineColor: getColor,
      getFillColor: getColor,
      opacity: 0.4,
      // Alternatively: contrast outlines with solids:
      // getLineColor: getColor,
      // getFillColor: [255,255,255],
      data: data.slice(),
      ...rest,
    },
  };
}
