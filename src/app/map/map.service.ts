import { EventEmitter, Injectable } from '@angular/core';
import { GeoJSON, geoJson, Layer } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { GeoJsonObject } from 'geojson';
import { capitols, centerOfEurope, darkMatterNoLabelsLayer, euBorderStyle } from './map.constants';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class MapService {
  resetMap$ = new EventEmitter<string>();
  toMyLocation$ = new EventEmitter<string>();
  showEuBorders$ = new EventEmitter<boolean>();
  showCapitols$ = new EventEmitter<boolean>();

  private readonly euBordersLayer: Promise<GeoJSON>;

  constructor(
    private http: HttpClient,
    private log: NGXLogger,
    private notificationService: NotificationService
  ) {
    this.euBordersLayer = this.initEuBordersLayer();
  }

  private async initEuBordersLayer() {
    return firstValueFrom(this.http.get<GeoJsonObject>('./assets/geo-data/european-borders.json2'))
      .then(jsonResponse => {
        this.log.debug('Loaded borders json', jsonResponse);
        return geoJson(jsonResponse, { style: euBorderStyle });
      })
      .catch(err => {
        this.notificationService.showError('Error loading EU borders geo json', err);
        return geoJson();
      });
  }

  getCenterOfEurope() {
    return centerOfEurope;
  }

  async loadAllLayers(): Promise<Layer[]> {
    return Promise.all([this.getBaseLayer(), this.getEuBordersLayer(), this.getCapitolsLayer()]);
  }

  private async getBaseLayer() {
    return darkMatterNoLabelsLayer;
  }

  private async getEuBordersLayer() {
    return this.euBordersLayer;
  }

  // TODO load capitols via HTTP
  private async getCapitolsLayer() {
    return capitols;
  }

  async resetMapToEuropeanCenter() {
    this.log.info('Reset map');
    this.resetMap$.emit();
  }

  async moveMapToMyLocation() {
    this.log.info('Move map to my location');
    this.toMyLocation$.emit();
  }

  async doShowEuBorders(value: boolean) {
    this.log.trace('Show EU borders', value);
    this.showEuBorders$.emit(value);
  }

  async doShowCapitols(value: boolean) {
    this.log.trace('Show capitols', value);
    this.showCapitols$.emit(value);
  }
}
