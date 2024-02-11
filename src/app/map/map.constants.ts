// TODO find a way to configure color
import { circleMarker, latLng, layerGroup, tileLayer } from 'leaflet';

export const euBorderStyle = {
  color: '#fff',
  fillColor: '#fff',
  opacity: 0.3,
  weight: 0.5,
  fillOpacity: 0.06
};

export const darkMatterNoLabelsLayer = tileLayer('/tiles/dark-matter/dark_nolabels/{z}/{x}/{y}{r}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

export const centerOfEurope = latLng(54.526, 15.2551);

// TODO find a way to configure color
const berlin = circleMarker([52.52, 13.405], {
  radius: 8,
  weight: 2,
  color: 'yellow'
}).bindPopup('Berlin', {
  closeButton: false
});

export const capitols = layerGroup([berlin]);

export const defaultZoom = 5;
