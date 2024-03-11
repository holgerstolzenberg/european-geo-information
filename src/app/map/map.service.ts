import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import {
  CAPITOLS_LAYER,
  DEFAULT_TRANSITION_DURATION_MS,
  DEFAULT_ZOOM,
  FLY_TO_ZOOM,
  INITIAL_VIEW_STATE,
  LayerIndices,
  MAP_CENTER
} from './map.constants';
import { NotificationService } from '../notifications/notification.service';
import { Deck, FlyToInterpolator, Layer } from '@deck.gl/core/typed';
import { BitmapLayer, GeoJsonLayer } from '@deck.gl/layers/typed';
import { catchError, delay, firstValueFrom, forkJoin, map, Observable, of, Subject } from 'rxjs';
import { TileLayer } from '@deck.gl/geo-layers/typed';
import { environment } from '../../environments/environment';
import { DeckMetrics } from '@deck.gl/core/typed/lib/deck';
import { GeoService } from './geo.service';

@Injectable()
export class MapService {
  loading$ = new EventEmitter<string>();

  private currentViewState = INITIAL_VIEW_STATE;

  private layers$ = new Observable<Layer[]>();
  private layers = new Array<Layer>(3);

  private myLocation?: GeolocationCoordinates;
  private loadingIndicator$?: Subject<boolean>;
  private theMap?: Deck;

  constructor(
    private readonly http: HttpClient,
    private readonly log: NGXLogger,
    private readonly geoService: GeoService,
    private readonly notificationService: NotificationService
  ) {
    this.layers$ = this.loadAllLayers();
  }

  private loadEuGeoJson() {
    return this.http.get<JSON>('./assets/geo-data/eu-borders.json');
  }

  loadAllLayers(): Observable<Layer[]> {
    return forkJoin(
      {
        mapLayer: this.initMapLayer(),
        euGeoJsonData: this.loadEuGeoJson(),
        capitolsLayer: this.initCapitolsLayer()
      }
    ).pipe(
      map(
        data => {
          const layers = new Array<Layer>(3);
          layers[LayerIndices.MAP_LAYER] = data.mapLayer;
          layers[LayerIndices.EU_BORDERS_LAYER] = this.initEuBordersLayer(data.euGeoJsonData);
          layers[LayerIndices.CAPITOLS_LAYER] = data.capitolsLayer;
          return layers;
        }),
      catchError(err => {
        this.notificationService.showError('Error loading EU borders geo json', err);
        throw err;
      })
    );
  }

  async resetMapToEuropeanCenter() {
    return this.transitionMapAnimated(MAP_CENTER.longitude, MAP_CENTER.latitude, DEFAULT_ZOOM);
  }

  async moveMapToMyLocation() {
    if (this.myLocation) {
      return this.transitionMapAnimated(this.myLocation.longitude, this.myLocation.latitude, FLY_TO_ZOOM);
    }

    this.loadingIndicator$?.next(true);

    return firstValueFrom(this.geoService.myCurrentLocation()).then(coordinates => {
      this.myLocation = coordinates;
      this.transitionMapAnimated(coordinates.longitude, coordinates.latitude, FLY_TO_ZOOM);
    });
  }

  async doShowEuBorders(value: boolean) {
    this.changeLayerVisibility(LayerIndices.EU_BORDERS_LAYER, value).then(() =>
      this.log.trace('Show EU borders', value)
    );
  }

  async doShowCapitols(value: boolean) {
    this.changeLayerVisibility(LayerIndices.CAPITOLS_LAYER, value).then(() => this.log.trace('Show capitols', value));
  }

  initDeckGlMap(
    mapDiv: ElementRef<HTMLDivElement>,
    metricsRef: Subject<DeckMetrics>,
    showLoader$: Subject<boolean>,
    mapHidden$: Subject<boolean>
  ) {
    this.loadingIndicator$ = showLoader$;

    this.layers$.subscribe(layers => {
      this.layers = layers;

      this.theMap = new Deck({
        parent: mapDiv.nativeElement,
        viewState: this.currentViewState,
        style: { position: 'relative', top: '0', bottom: '0' },
        controller: true,
        useDevicePixels: false,
        layers: [layers],

        // necessary game changer to get transitions working
        // see: https://github.com/visgl/deck.gl/issues/2102
        onViewStateChange: ({ viewState }) => {
          this.currentViewState = viewState;
          this.theMap!.setProps({ viewState: this.currentViewState });
        },

        _onMetrics: metrics => {
          metricsRef.next(metrics);
        },

        onLoad: () => {
          of([]).pipe(
            delay(1000)
          ).subscribe(() => {
            this.log.debug('Deck GL map is ready');
            mapHidden$.next(false);
          });
        }
      });
    });
  }

  async doPitchMap(mapPitch: number) {
    return new Promise(() => {
      this.loadingIndicator$?.next(true);

      this.currentViewState = Object.assign({}, this.currentViewState, {
        pitch: mapPitch
      });

      this.theMap!.setProps({ viewState: this.currentViewState });
      this.loadingIndicator$?.next(false);
    });
  }

  private async transitionMapAnimated(longitude: number, latitude: number, zoom: number) {
    return new Promise(() => {
      this.loadingIndicator$?.next(true);

      this.currentViewState = Object.assign({}, this.currentViewState, {
        longitude: longitude,
        latitude: latitude,
        zoom: zoom,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: DEFAULT_TRANSITION_DURATION_MS
      });

      this.theMap!.setProps({ viewState: this.currentViewState });
      this.loadingIndicator$?.next(false);
    });
  }

  private initMapLayer() {
    const mapLayer = new TileLayer({
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

    return of(mapLayer);
  }

  private initEuBordersLayer(geoJson: JSON) {
    return new GeoJsonLayer({
      id: 'eu-borders-layer',
      data: geoJson,
      pickable: false,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 1,
      getFillColor: [255, 214, 23, 10],
      getLineColor: [255, 214, 23, 50],
      getElevation: 0,
      visible: true
    });
  }

  // TODO feature: load capitols via HTTP and add population
  private initCapitolsLayer() {
    return of(CAPITOLS_LAYER);
  }

  private async changeLayerVisibility(index: number, value: boolean) {
    const clonedLayers = this.layers.slice();
    clonedLayers[index] = this.layers[index].clone({ visible: value });

    this.theMap!.setProps({ layers: clonedLayers });
    this.layers = clonedLayers;
  }
}
