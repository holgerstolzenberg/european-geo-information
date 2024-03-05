import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from './map.service';
import { NGXLogger } from 'ngx-logger';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';
import { Deck, Layer } from '@deck.gl/core/typed';
import { INITIAL_VIEW_STATE, LayerIndices } from './map.constants';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  layers: Promise<Layer[]>;
  showLoader: boolean = false;

  //private theZoom?: number;

  private onUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('deckGlMap', { static: false }) mapDiv?: ElementRef<HTMLDivElement>;

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
    // TODO deck.gl: show metrics
    this.layers.then(layers => {
      this.map = new Deck({
        parent: this.mapDiv?.nativeElement,
        initialViewState: INITIAL_VIEW_STATE,
        style: { position: 'relative' },
        width: '100vw',
        height: '100vh',
        controller: true,
        useDevicePixels: false,
        layers: [layers],
        onWebGLInitialized: gl => {
          gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE);
          gl.blendEquation(gl.FUNC_ADD);
        }
      });
    });
  }

  private initAllSubscriptions() {
    this.mapService.resetMap$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(() => {
      // TODO deck.gl: this.resetMap();
    });

    this.mapService.toMyLocation$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(() => {
      // TODO deck.gl: this.myLocation();
    });

    this.mapService.showEuBorders$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(() => {
      // TODO deck.gl: this.showEuBorders(value);
    });

    this.mapService.showCapitols$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(() => {
      // TODO deck.gl: this.showCapitols(value);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
    this.disposeMap();
  }

  private unsubscribeAll() {
    this.onUnsubscribe$.next(true);
    this.onUnsubscribe$.complete();
  }

  private disposeMap() {
    // TODO deck.gl: dispose map map
    this.log.info('Disposed theMap');
  }

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

  // onMapZoomStart() {
  //   this.log.debug('MapZoomStart: zoom set to', this.theZoom);
  //   this.showLoader = true;
  // }

  // onMapZoomEnd(event: LeafletEvent) {
  //   this.theZoom = event.target.getZoom();
  //   this.log.debug('MapZoomEnd: zoom set to', this.theZoom);
  //   this.showLoader = false;
  // }

  // resetMap() {
  //   this.theMap!.flyTo(centerOfEurope, defaultZoom);
  //   // TODO deck.gl: clear my location marker
  // }

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

  // private showEuBorders(value: boolean) {
  //   this.layers
  //     .then(layer => {
  //       return layer[LayerIndices.EU_LAYER_INDEX] as GeoJSON;
  //     })
  //     .then(l => l.setStyle(value ? euBorderStyle : noDrawStyle));
  // }

  // private showCapitols(value: boolean) {
  //   this.theMap!.closePopup();
  //
  //   this.layers
  //     .then(layer => {
  //       return layer[LayerIndices.CAPITOLS_LAYER_INDEX] as LayerGroup;
  //     })
  //     .then(capitols => capitols.getLayers().forEach(capitol => this.markerVisible(capitol, value)));
  // }

  // TODO deck.gl: does that work
  private markerVisible(layer: Layer, visible: boolean) {
    layer.setState({ visible: visible });
  }
}
