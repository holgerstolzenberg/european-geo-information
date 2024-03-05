import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { CAPITOLS_LAYER, CENTER_OF_EUROPE, MAP_LAYER } from './map.constants';
import { NotificationService } from '../notifications/notification.service';
import { Layer } from '@deck.gl/core/typed';
import { GeoJsonLayer } from '@deck.gl/layers/typed';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MapService {
  resetMap$ = new EventEmitter<string>();
  toMyLocation$ = new EventEmitter<string>();
  showEuBorders$ = new EventEmitter<boolean>();
  showCapitols$ = new EventEmitter<boolean>();

  private readonly euBordersLayer: Promise<GeoJsonLayer>;

  constructor(
    private readonly http: HttpClient,
    private readonly log: NGXLogger,
    private readonly notificationService: NotificationService
  ) {
    this.euBordersLayer = this.initEuBordersLayer();
  }

  private async initEuBordersLayer() {
    return firstValueFrom(this.http.get<JSON>('./assets/geo-data/eu-borders.json'))
      .then(geoJson => {
        this.log.debug('Loaded borders json', geoJson);

        return new GeoJsonLayer({
          id: 'eu-borders-layer',
          data: geoJson,
          pickable: false,
          stroked: true,
          filled: true,
          lineWidthMinPixels: 1,
          getFillColor: [255, 214, 23, 15],
          getLineColor: [255, 214, 23],
          getElevation: 0
        });
      })
      .catch(err => {
        this.notificationService.showError('Error loading EU borders geo json', err);
        return new GeoJsonLayer({ id: 'eu-borders-layer' });
      });
  }

  // TODO deck.gl: do not forget this method
  getCenterOfEurope() {
    return CENTER_OF_EUROPE;
  }

  async loadAllLayers(): Promise<Layer[]> {
    return Promise.all([this.getMapLayer(), this.getEuBordersLayer(), this.getCapitolsLayer()]);
  }

  private getMapLayer() {
    return MAP_LAYER;
  }

  private getEuBordersLayer() {
    return this.euBordersLayer;
  }

  // TODO feature: load capitols via HTTP and add population
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
