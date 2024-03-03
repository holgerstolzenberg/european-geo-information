// TODO find a way to configure color
import {
  CircleMarker,
  circleMarker,
  Control,
  latLng,
  LayerGroup,
  layerGroup,
  tileLayer,
  ZoomPanOptions
} from 'leaflet';
import { environment } from '../../environments/environment';
import AttributionOptions = Control.AttributionOptions;

export const attributionOptions: AttributionOptions = {
  position: 'bottomleft',
  prefix: ''
};

export const defaultZoomPanOptions: ZoomPanOptions = {
  animate: true,
  duration: 1
};

export const noDrawStyle = { radius: 0, opacity: 0, fill: false, stroke: false, popup: false };

export const euBorderStyle = {
  color: '#fff',
  fillColor: '#fff',
  opacity: 0.4,
  weight: 0.6,
  fillOpacity: 0.06,
  fill: true,
  stroke: true
};

export const darkMatterNoLabelsLayer = tileLayer(environment.tileServerUrl, {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

export const centerOfEurope = latLng(54.526, 15.2551);

// TODO find a way to configure color
export const defaultCapitolsStyle = {
  radius: 8,
  weight: 2,
  color: '#ffd617',
  opacity: 1.0,
  fill: true,
  stroke: true,
  popup: true
};

const berlin = circleMarker([52.52, 13.405], defaultCapitolsStyle).bindPopup('Berlin', { closeButton: false });

export const capitols: LayerGroup<CircleMarker> = layerGroup([berlin]);

export const defaultZoom = 5;

export enum LayerIndices {
  BASE_LAYER_INDEX = 0,
  EU_LAYER_INDEX = 1,
  CAPITOLS_LAYER_INDEX = 2
}
