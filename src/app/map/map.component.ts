import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from './map.service';
import { NGXLogger } from 'ngx-logger';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';
import { Deck } from '@deck.gl/core/typed';
import { INITIAL_VIEW_STATE, LayerIndices } from './map.constants';
import { DeckMetrics } from '@deck.gl/core/typed/lib/deck';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  showLoader: boolean = false;
  showMetrics: boolean = true;
  loadedTileId: string = '';

  readonly metrics$?: Subject<DeckMetrics> = new Subject<DeckMetrics>();

  private readonly onUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('deckGlMap', { static: false }) private mapDiv?: ElementRef<HTMLDivElement>;
  private map?: Deck;

  constructor(
    private log: NGXLogger,
    private mapService: MapService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initAllSubscriptions();
  }

  ngAfterViewInit() {
    this.initDeckGlMap();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
    this.disposeMap();
  }

  initDeckGlMap() {
    this.mapService.getLayers().then(layers => {
      this.map = new Deck({
        parent: this.mapDiv!.nativeElement,
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
          this.metrics$!.next(metrics);
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
      this.notificationService.showWarnLocalized('common.not-implemented');
    });

    // TODO deck.gl: this.myLocation();
    this.mapService.toMyLocation$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(() => {
      this.notificationService.showWarnLocalized('common.not-implemented');
    });

    this.mapService.showEuBorders$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(value => {
      this.mapService.changeLayerVisibility(this.map!, LayerIndices.EU_LAYER_INDEX, value);
    });

    this.mapService.showCapitols$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(value => {
      this.mapService.changeLayerVisibility(this.map!, LayerIndices.CAPITOLS_LAYER_INDEX, value);
    });
  }

  private showHideLoader(tileId: string) {
    this.loadedTileId = tileId;
    this.showLoader = true;
    setTimeout(() => (this.showLoader = false), 500);
  }

  private unsubscribeAll() {
    this.onUnsubscribe$.next(true);
    this.onUnsubscribe$.complete();
    this.onUnsubscribe$!.unsubscribe();

    this.metrics$!.complete();
    this.metrics$!.unsubscribe();
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
