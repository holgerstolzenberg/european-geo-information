import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import {
  CAPITOLS_LAYER,
  CENTER_OF_EUROPE,
  DEFAULT_TRANSITION_DURATION_MS,
  FLY_TO_ZOOM,
  INITIAL_VIEW_STATE,
  LayerIndices
} from './map.constants';
import { NotificationService } from '../notifications/notification.service';
import { Deck, FlyToInterpolator, Layer } from '@deck.gl/core/typed';
import { BitmapLayer, GeoJsonLayer } from '@deck.gl/layers/typed';
import { firstValueFrom, Subject } from 'rxjs';
import { TileLayer } from '@deck.gl/geo-layers/typed';
import { environment } from '../../environments/environment';
import { DeckMetrics } from '@deck.gl/core/typed/lib/deck';

@Injectable()
export class MapService {
  resetMap$ = new EventEmitter<string>();
  loading$ = new EventEmitter<string>();

  private readonly mapLayer: Promise<TileLayer>;
  private readonly euBordersLayer: Promise<GeoJsonLayer>;
  private readonly layers: Promise<Layer[]>;

  private map?: Deck;

  constructor(
    private readonly http: HttpClient,
    private readonly log: NGXLogger,
    private readonly notificationService: NotificationService
  ) {
    this.mapLayer = this.initMapLayer();
    this.euBordersLayer = this.initEuBordersLayer();
    this.layers = this.loadAllLayers();
  }

  async loadAllLayers(): Promise<Layer[]> {
    return Promise.all([this.getMapLayer(), this.getEuBordersLayer(), this.getCapitolsLayer()]);
  }

  resetMapToEuropeanCenter() {
    this.log.debug('Reset map');
    this.resetMap$.emit();
  }

  moveMapToMyLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.map!.setProps({
          initialViewState: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            zoom: FLY_TO_ZOOM,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: DEFAULT_TRANSITION_DURATION_MS
          }
        });

        this.log.debug('Moved map to my location:', position.coords);
      },
      err => this.notificationService.showError('Could not get geolocation', err)
    );
  }

  async doShowEuBorders(value: boolean) {
    this.changeLayerVisibility(LayerIndices.EU_LAYER_INDEX, value).then(() => this.log.trace('Show EU borders', value));
  }

  async doShowCapitols(value: boolean) {
    this.changeLayerVisibility(LayerIndices.CAPITOLS_LAYER_INDEX, value).then(() =>
      this.log.trace('Show capitols', value)
    );
  }

  initDeckGlMap(mapDiv: ElementRef<HTMLDivElement>, metricsRef: Subject<DeckMetrics>) {
    this.layers.then(layers => {
      this.map = new Deck({
        parent: mapDiv.nativeElement,
        initialViewState: INITIAL_VIEW_STATE,
        style: { position: 'relative', top: '0', bottom: '0' },
        controller: true,
        useDevicePixels: false,
        layers: [layers],

        onWebGLInitialized: gl => {
          gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE);
          gl.blendEquation(gl.FUNC_ADD);
        },

        _onMetrics: metrics => {
          metricsRef.next(metrics);
        }
      });
    });
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

  private async changeLayerVisibility(layerIndex: number, value: boolean) {
    this.layers.then(layers => {
      const clonedLayers = layers.slice();
      clonedLayers[layerIndex] = layers[layerIndex].clone({ visible: value });
      this.map!.setProps({ layers: clonedLayers });
    });
  }

  // TODO deck.gl: do not forget this method
  private async getCenterOfEurope() {
    return CENTER_OF_EUROPE;
  }

  // TODO feature: load capitols via HTTP and add population
  private async getCapitolsLayer() {
    return CAPITOLS_LAYER;
  }

  private getMapLayer() {
    return this.mapLayer;
  }

  private async getEuBordersLayer() {
    return this.euBordersLayer;
  }
}
