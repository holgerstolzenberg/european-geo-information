import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { CAPITOLS_LAYER, CENTER_OF_EUROPE } from './map.constants';
import { NotificationService } from '../notifications/notification.service';
import { Layer } from '@deck.gl/core/typed';
import { BitmapLayer, GeoJsonLayer } from '@deck.gl/layers/typed';
import { firstValueFrom } from 'rxjs';
import { TileLayer } from '@deck.gl/geo-layers/typed';
import { environment } from '../../environments/environment';

@Injectable()
export class MapService {
  resetMap$ = new EventEmitter<string>();
  toMyLocation$ = new EventEmitter<string>();
  showEuBorders$ = new EventEmitter<boolean>();
  showCapitols$ = new EventEmitter<boolean>();
  loading$ = new EventEmitter<string>();

  private readonly mapLayer: Promise<TileLayer>;
  private readonly euBordersLayer: Promise<GeoJsonLayer>;

  constructor(
    private readonly http: HttpClient,
    private readonly log: NGXLogger,
    private readonly notificationService: NotificationService
  ) {
    this.mapLayer = this.initMapLayer();
    this.euBordersLayer = this.initEuBordersLayer();
  }

  private async initMapLayer() {
    return new TileLayer({
      id: 'map-layer',
      data: environment.tileServerUrls,
      maxRequests: 20,
      pickable: false,
      tileSize: 256,
      onTileLoad: d => {
        this.loading$.emit(d.id);
      },

      // using 'never' in next two lines is just a hack for typescript
      // see: https://github.com/visgl/deck.gl/issues/8467
      renderSubLayers: props => {
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
  }

  private async initEuBordersLayer() {
    return firstValueFrom(this.http.get<JSON>('./assets/geo-data/eu-borders.json'))
      .then(geoJson => {
        this.log.info('Loaded borders json', geoJson);

        return new GeoJsonLayer({
          id: 'eu-borders-layer',
          data: geoJson,
          pickable: false,
          stroked: true,
          filled: true,
          lineWidthMinPixels: 1,
          getFillColor: [255, 214, 23, 5],
          getLineColor: [255, 214, 23, 50],
          getElevation: 0,
          visible: true
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
    return this.mapLayer;
  }

  private async getEuBordersLayer() {
    return this.euBordersLayer;
  }

  // TODO feature: load capitols via HTTP and add population
  private async getCapitolsLayer() {
    return CAPITOLS_LAYER;
  }

  async resetMapToEuropeanCenter() {
    this.log.debug('Reset map');
    this.resetMap$.emit();
  }

  async moveMapToMyLocation() {
    this.log.debug('Move map to my location');
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
