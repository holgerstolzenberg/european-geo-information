import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from './map.service';
import { NGXLogger } from 'ngx-logger';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';
import { DeckMetrics } from '@deck.gl/core/typed/lib/deck';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('deckGlMap', { static: false }) private mapDiv?: ElementRef<HTMLDivElement>;

  showLoader: boolean = false;
  showMetrics: boolean = true;
  loadedTileId: string = '';

  readonly metrics$: Subject<DeckMetrics> = new Subject<DeckMetrics>();

  private readonly onUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private log: NGXLogger,
    private mapService: MapService,
    private notificationService: NotificationService
  ) {
    this.metrics$.pipe(takeUntil(this.onUnsubscribe$));
  }

  ngOnInit(): void {
    this.initAllSubscriptions();
  }

  ngAfterViewInit() {
    this.mapService.initDeckGlMap(this.mapDiv!, this.metrics$!);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
    this.disposeMap();
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
  }

  private showHideLoader(tileId: string) {
    this.loadedTileId = tileId;
    this.showLoader = true;
    setTimeout(() => (this.showLoader = false), 1000);
  }

  private unsubscribeAll() {
    this.onUnsubscribe$.next(true);
    this.onUnsubscribe$.complete();
    this.onUnsubscribe$!.unsubscribe();
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
