import { Injectable } from '@angular/core';
import { circleMarker, geoJson, latLng, Layer, layerGroup, tileLayer } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { GeoJsonObject } from 'geojson'; // TODO find a way to configure color

// TODO find a way to configure color
const euBorderStyle = {
  color: '#fff',
  fillColor: '#fff',
  opacity: 0.3,
  weight: 0.5,
  fillOpacity: 0.06
};

const darkMatterNoLabelsLayer = tileLayer('/tiles/dark-matter/dark_nolabels/{z}/{x}/{y}{r}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

const centerOfEurope = latLng(54.526, 15.2551);

// TODO find a way to configure color
const berlin = circleMarker([52.52, 13.405], {
  radius: 8,
  weight: 2,
  color: 'yellow'
}).bindPopup('Berlin', {
  closeButton: false
});

const capitols = layerGroup([berlin]);

@Injectable()
export class MapService {
  constructor(
    private http: HttpClient,
    private log: NGXLogger
  ) {}

  getBaseLayer() {
    return darkMatterNoLabelsLayer;
  }

  getCenterOfEurope() {
    return centerOfEurope;
  }

  load(layers: Layer[]) {
    this.http.get<GeoJsonObject>('assets/geo-data/european-borders.json').subscribe((json: GeoJsonObject) => {
      this.log.info('Loaded borders json', json);

      layers.push(geoJson(json, { style: euBorderStyle }));
      layers.push(capitols);
    });
  }
}
