import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { CAPITOLS_LAYER, CENTER_OF_EUROPE, MAP_LAYER } from './map.constants';
import { NotificationService } from '../notifications/notification.service';
import { Layer } from '@deck.gl/core/typed';
import { GeoJsonLayer } from '@deck.gl/layers/typed';

@Injectable()
export class MapService {
  resetMap$ = new EventEmitter<string>();
  toMyLocation$ = new EventEmitter<string>();
  showEuBorders$ = new EventEmitter<boolean>();
  showCapitols$ = new EventEmitter<boolean>();

  private readonly euBordersLayer?: GeoJsonLayer;

  constructor(
    private readonly http: HttpClient,
    private readonly log: NGXLogger,
    private readonly notificationService: NotificationService
  ) {
    //this.euBordersLayer = this.initEuBordersLayer();
    //this.euBordersLayer = new GeoJsonLayer({});
  }

  // private async initEuBordersLayer() {
  //   return firstValueFrom(this.http.get<JSON>('./assets/geo-data/european-borders.json'))
  //     .then(jsonResponse => {
  //       this.log.debug('Loaded borders json', jsonResponse);
  //       return new GeoJsonLayer(jsonResponse, { style: euBorderStyle });
  //     })
  //     .catch(err => {
  //       this.notificationService.showError('Error loading EU borders geo json', err);
  //       return geoJson();
  //     });
  // }

  getCenterOfEurope() {
    return CENTER_OF_EUROPE;
  }

  async loadAllLayers(): Promise<Layer[]> {
    // TODO deck.gl impl
    // return Promise.all([this.getBaseLayer(), this.getEuBordersLayer(), this.getCapitolsLayer()]);
    return Promise.all([this.getBaseLayer(), this.getCapitolsLayer()]);
  }

  private getBaseLayer() {
    return MAP_LAYER;
  }

  private getEuBordersLayer() {
    return this.euBordersLayer;
  }

  // TODO load capitols via HTTP
  private async getCapitolsLayer() {
    return CAPITOLS_LAYER;
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
