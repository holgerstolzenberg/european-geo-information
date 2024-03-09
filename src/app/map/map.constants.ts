import { ScatterplotLayer } from '@deck.gl/layers/typed';

export const DEFAULT_ZOOM = 4;
export const DEFAULT_PITCH = 40;
export const DEFAULT_TRANSITION_DURATION_MS = 'auto';

export const FLY_TO_ZOOM = 7;

export const MAP_CENTER = {
  longitude: 15.2551,
  latitude: 49
};

export const INITIAL_VIEW_STATE: Record<string, number> = {
  latitude: MAP_CENTER.latitude,
  longitude: MAP_CENTER.longitude,
  zoom: DEFAULT_ZOOM,
  minZoom: 3,
  maxZoom: 10,
  pitch: DEFAULT_PITCH,
  bearing: 0
};

export const BERLIN = [52.52, 13.405];

// TODO feature: capitol names, population
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
  getPosition: d => [d.coordinates[1], d.coordinates[0], 50], // need a bit of altitude for proper rendering
  getLineColor: () => [255, 214, 23, 255],
  getFillColor: () => [255, 214, 23, 50],
  getLineWidth: () => 3000
});

export enum LayerIndices {
  MAP_LAYER = 0,
  EU_BORDERS_LAYER = 1,
  CAPITOLS_LAYER = 2
}
