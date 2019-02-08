import {COORDINATE_SYSTEM} from 'deck.gl';

export function cellLayerDefaultProps(cells, updateStatus) {
  return {
    coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
    data: Object.entries(cells),
    pickable: true,
    autoHighlight: true,
    stroked: true,
    filled: true,
    getElevation: 0,
    getLineColor: [80, 80, 80],
    getLineWidth: 0,
    onHover: info => {
      if (info.object) { updateStatus(`Cluster: ${info.object[1].cluster}`) }
    }
  }
}

// TODO: Dynamic palette generation? Or set by user?
// from http://colorbrewer2.org/?type=qualitative&scheme=Paired&n=12#type=qualitative&scheme=Paired&n=12
export const PALETTE = [
  [166,206,227],
  [31,120,180],
  [178,223,138],
  [51,160,44],
  [251,154,153],
  [227,26,28],
  [253,191,111],
  [255,127,0],
  [202,178,214],
  [106,61,154],
  [255,255,153],
  [177,89,40]
];