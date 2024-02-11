import { EventEmitter, Injectable, Output } from '@angular/core';
import { geoJson, Layer } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { GeoJsonObject } from 'geojson';
import { capitols, centerOfEurope, darkMatterNoLabelsLayer, euBorderStyle } from './map.constants';

@Injectable()
export class MapService {
  @Output() resetMap = new EventEmitter<string>();

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
    this.http.get<GeoJsonObject>('/assets/geo-data/european-borders.json').subscribe((json: GeoJsonObject) => {
      this.log.info('Loaded borders json', json);

      layers.push(geoJson(json, { style: euBorderStyle }));
      layers.push(capitols);
    });
  }

  onResetMap() {
    this.log.info('Rest map to your position');
    this.resetMap.emit();
  }
}
