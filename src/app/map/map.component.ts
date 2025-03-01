import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MapService } from './map.service';
import { BehaviorSubject, delay, of, Subject, take, takeUntil } from 'rxjs';
import { DeckMetrics } from '@deck.gl/core/dist/lib/deck';
import { AsyncPipe, DecimalPipe, NgClass } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  imports: [
    NgClass,
    AsyncPipe,
    TranslocoPipe,
    DecimalPipe,
    TranslocoDirective
  ]
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('deckGlMap', { static: false }) private mapDiv?: ElementRef<HTMLDivElement>;

  showMetrics: boolean = true;
  loadedTileId: string = '';

  showLoader$ = new Subject<boolean>();
  mapHidden$ = new BehaviorSubject<boolean>(true);

  readonly metrics$: Subject<DeckMetrics> = new Subject<DeckMetrics>();

  private readonly onUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private mapService: MapService) {
    this.metrics$.pipe(takeUntil(this.onUnsubscribe$));
    this.mapService.loading$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(tileId => this.showHideLoader(tileId));
    this.showLoader$.pipe(takeUntil(this.onUnsubscribe$)).subscribe();
    this.mapHidden$.pipe(takeUntil(this.onUnsubscribe$)).subscribe();
  }

  ngAfterViewInit() {
    this.mapService.initDeckGlMap(this.mapDiv!, this.metrics$, this.showLoader$, this.mapHidden$);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  private showHideLoader(tileId: string) {
    this.loadedTileId = tileId;
    this.showLoader$.next(true);

    of([]).pipe(
      delay(1000),
      take(1)
    ).subscribe(() => {
      this.showLoader$.next(false);
    });
  }

  private unsubscribeAll() {
    this.onUnsubscribe$.next(true);
    this.onUnsubscribe$.complete();
    this.onUnsubscribe$.unsubscribe();
  }
}
