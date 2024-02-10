import {Component} from '@angular/core';
import {circleMarker, latLng, layerGroup, MapOptions, tileLayer} from 'leaflet'

const openStreetMaps = tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {attribution: 'Open Streetmap', detectRetina: true}
);

const berlinC = circleMarker(
  [52.5200, 13.4050],
  {radius: 8, weight: 2, color: '#2626b9'}
).bindPopup('Berlin');

const capitols = layerGroup([berlinC]);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.sass'
})
export class MapComponent {
  options: MapOptions = {
    zoom: 4,
    minZoom: 3,
    maxZoom: 15,
    center: latLng(54.5260, 15.2551) // Center of europe
  }

  layers = [
    openStreetMaps,
    capitols
  ];
}
