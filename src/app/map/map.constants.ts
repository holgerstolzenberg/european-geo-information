// TODO find a way to configure color
import { circleMarker, latLng, layerGroup, tileLayer } from 'leaflet';
import { environment } from '../../environments/environment';

export const euBorderStyle = {
  color: '#fff',
  fillColor: '#fff',
  opacity: 0.4,
  weight: 0.6,
  fillOpacity: 0.06
};

export const darkMatterNoLabelsLayer = tileLayer(environment.tileServerUrl, {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

export const centerOfEurope = latLng(54.526, 15.2551);

// TODO find a way to configure color
const berlin = circleMarker([52.52, 13.405], {
  radius: 8,
  weight: 2,
  color: '#ffd617'
}).bindPopup('Berlin', {
  closeButton: false
});

export const capitols = layerGroup([berlin]);

export const defaultZoom = 5;
