import { BitmapLayer, ScatterplotLayer } from '@deck.gl/layers/typed';
import { TileLayer } from '@deck.gl/geo-layers/typed';
import { environment } from '../../environments/environment';

export const DEFAULT_ZOOM = 5;

export const CENTER_OF_EUROPE = [54.526, 15.2551];

export const INITIAL_VIEW_STATE = {
  latitude: CENTER_OF_EUROPE[0],
  longitude: CENTER_OF_EUROPE[1],
  zoom: DEFAULT_ZOOM,
  minZoom: 0,
  maxZoom: 19,
  pitch: 0,
  bearing: 0
};

export const MAP_LAYER = new TileLayer({
  id: 'map-layer',
  data: environment.tileServerUrls,
  maxRequests: 10,
  pickable: false,
  tileSize: 256,

  renderSubLayers: props => {
    // using never in next two lines is just a hack for typescript
    // see:
    const {
      bbox: { west, south, east, north }
    } = props.tile as never;

    const what = { ...props, data: undefined };

    return [
      new BitmapLayer(what as never, {
        image: props.data,
        bounds: [west, south, east, north]
      })
    ];
  }
});

// TODO attribution
// export const darkMatterNoLabelsLayer = new TileLayer(environment.tileServerUrl, {
//   attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
// });

export const BERLIN = [52.52, 13.405];

// TODO popup
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
  getRadius: () => 2000,
  getPosition: d => [d.coordinates[1], d.coordinates[0]], // only explicit syntax works
  getLineColor: () => [255, 214, 23, 255],
  getFillColor: () => [255, 214, 23, 50],
  getLineWidth: () => 3000
});

export enum LayerIndices {
  BASE_LAYER_INDEX = 0,
  EU_LAYER_INDEX = 1,
  CAPITOLS_LAYER_INDEX = 2
}
