import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from './map.service';
import { NGXLogger } from 'ngx-logger';
import { Subject, takeUntil } from 'rxjs';
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
    private mapService: MapService
  ) {
    this.metrics$.pipe(takeUntil(this.onUnsubscribe$));
  }

  ngOnInit(): void {
    this.initAllSubscriptions();
  }

  ngAfterViewInit() {
    this.mapService.initDeckGlMap(this.mapDiv!, this.metrics$);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  private initAllSubscriptions() {
    // prettier-ignore
    this.mapService.loading$
        .pipe(takeUntil(this.onUnsubscribe$))
        .subscribe(tileId => this.showHideLoader(tileId));
  }

  private showHideLoader(tileId: string) {
    this.loadedTileId = tileId;
    this.showLoader = true;
    setTimeout(() => (this.showLoader = false), 1000);
  }

  private unsubscribeAll() {
    this.onUnsubscribe$.next(true);
    this.onUnsubscribe$.complete();
    this.onUnsubscribe$.unsubscribe();
  }
}
