import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from './map.service';
import { NGXLogger } from 'ngx-logger';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';
import { Deck, Layer } from '@deck.gl/core/typed';
import { INITIAL_VIEW_STATE, LayerIndices } from './map.constants';
import { DeckMetrics } from '@deck.gl/core/typed/lib/deck';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  layers: Promise<Layer[]>;

  showLoader: boolean = false;
  showMetrics: boolean = true;
  loadedTileId: string = '';

  metrics?: DeckMetrics;

  private onUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('deckGlMap', { static: false }) private mapDiv?: ElementRef<HTMLDivElement>;

  private map?: Deck;

  constructor(
    private log: NGXLogger,
    private mapService: MapService,
    private notificationService: NotificationService
  ) {
    this.layers = this.loadAllLayers();
  }

  ngOnInit(): void {
    this.initAllSubscriptions();
  }

  ngAfterViewInit() {
    this.initDeckGlMap();
  }

  private initDeckGlMap() {
    this.layers.then(layers => {
      this.map = new Deck({
        parent: this.mapDiv?.nativeElement,
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
          this.metrics = metrics;
        }
      });
    });
  }

  private initAllSubscriptions() {
    // prettier-ignore
    this.mapService.loading$
      .pipe(takeUntil(this.onUnsubscribe$))
      .subscribe(tileId => this.showHideLoader(tileId));

    // TODO deck.gl: this.resetMap();
    this.mapService.resetMap$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(() => {
      this.notificationService.showWarn('Not implemented yet');
    });

    // TODO deck.gl: this.myLocation();
    this.mapService.toMyLocation$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(() => {
      this.notificationService.showWarn('Not implemented yet');
    });

    // TODO deck.gl: maybe can be moved to service class
    this.mapService.showEuBorders$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(value => {
      this.layers.then(layer => {
        this.changeLayerVisibility(layer, LayerIndices.EU_LAYER_INDEX, value);
      });
    });

    // TODO deck.gl: maybe can be moved to service class
    this.mapService.showCapitols$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(value => {
      this.layers.then(layers => {
        this.changeLayerVisibility(layers, LayerIndices.CAPITOLS_LAYER_INDEX, value);
      });
    });
  }

  private changeLayerVisibility(layers: Layer[], layerIndex: number, value: boolean) {
    const clonedLayers = layers.slice();
    clonedLayers[layerIndex] = layers[layerIndex].clone({ visible: value });
    this.map!.setProps({ layers: clonedLayers });
  }

  private showHideLoader(tileId: string) {
    this.loadedTileId = tileId;
    this.showLoader = true;
    setTimeout(() => (this.showLoader = false), 500);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
    this.disposeMap();
  }

  private unsubscribeAll() {
    this.onUnsubscribe$.next(true);
    this.onUnsubscribe$.complete();
  }

  // TODO deck.gl: dispose deck map
  private disposeMap() {
    this.log.info('Disposed theMap');
  }

  // TODO deck.gl: map ready and attribution
  // onMapReady(map: LeafletMap) {
  //   this.theMap = map;
  //   this.log.info('Leaflet theMap ready');
  //   this.theMap.addControl(control.attribution(attributionOptions));
  //   this.theZoom = map.getZoom();
  // }

  private async loadAllLayers() {
    return this.mapService.loadAllLayers().then(([mapLayer, euBorderLayer, capitolsLayer]) => {
      const layers = new Array<Layer>(2);
      layers[LayerIndices.MAP_LAYER_INDEX] = mapLayer;
      layers[LayerIndices.EU_LAYER_INDEX] = euBorderLayer;
      layers[LayerIndices.CAPITOLS_LAYER_INDEX] = capitolsLayer;

      this.log.debug('Layers loaded', layers);
      return layers;
    });
  }

  // TODO deck.gl: implement method
  // resetMap() {
  //   this.theMap!.flyTo(centerOfEurope, defaultZoom);
  //   // TODO deck.gl: clear my location marker
  // }

  // TODO deck.gl: implement method
  // myLocation() {
  //   navigator.geolocation.getCurrentPosition(
  //     position =>
  //       this.theMap!.flyTo(
  //         latLng(position.coords.latitude, position.coords.longitude),
  //         defaultZoom + 2,
  //         defaultZoomPanOptions
  //       ),
  //     err => this.notificationService.showError('Could not get geolocation', err)
  //   );
  // }
}
