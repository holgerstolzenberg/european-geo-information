import { ScatterplotLayer } from '@deck.gl/layers/typed';

export const DEFAULT_ZOOM = 3;
export const DEFAULT_TRANSITION_DURATION_MS= 'auto';

export const FLY_TO_ZOOM = 7;

export const CENTER_OF_EUROPE = [54.526, 15.2551];

export const INITIAL_VIEW_STATE = {
  latitude: CENTER_OF_EUROPE[0],
  longitude: CENTER_OF_EUROPE[1],
  zoom: DEFAULT_ZOOM,
  minZoom: 3,
  maxZoom: 10,
  pitch: 0,
  bearing: 0
};

// TODO deck.gl: attribution
// export const darkMatterNoLabelsLayer = new TileLayer(environment.tileServerUrl, {
//   attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
// });

export const BERLIN = [52.52, 13.405];

// TODO deck.gl: popup
export const CAPITOLS_LAYER = new ScatterplotLayer({
  id: 'capitols-layer',
  data: [{ coordinates: BERLIN, radius: 30 }],
  pickable: false,
  radiusScale: 6,
  radiusMinPixels: 1,
  radiusMaxPixels: 1000,
  lineWidthMinPixels: 1,
  stroked: true,
  filled: true,
  colorFormat: 'RGBA',
  visible: true,
  getRadius: () => 2000,
  getPosition: d => [d.coordinates[1], d.coordinates[0]], // only explicit syntax works
  getLineColor: () => [255, 214, 23, 255],
  getFillColor: () => [255, 214, 23, 50],
  getLineWidth: () => 3000
});

export enum LayerIndices {
  MAP_LAYER = 0,
  EU_BORDERS_LAYER = 1,
  CAPITOLS_LAYER = 2
}
