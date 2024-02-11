import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Layer, LeafletEvent, Map as LeafletMap, MapOptions } from 'leaflet';
import { MapService } from './map.service';
import { NGXLogger } from 'ngx-logger';
import { centerOfEurope, defaultZoom } from './map.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.sass'
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() options: MapOptions = {
    zoom: defaultZoom,
    minZoom: 4,
    maxZoom: 20,
    center: this.mapService.getCenterOfEurope(),
    fadeAnimation: false,
    zoomAnimation: true,
    markerZoomAnimation: false
  };

  layers: Layer[] = [];

  private map?: LeafletMap;
  private theZoom?: number;
  private onReset?: Subscription;

  constructor(
    private log: NGXLogger,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.onReset = this.mapService.resetMap.subscribe(() => {
      this.resetMap();
    });
  }

  ngOnDestroy(): void {
    this.onReset!.unsubscribe();

    this.log.info('Disposing map');

    this.map!.clearAllEventListeners();
    this.map!.remove();
  }

  onMapReady(map: LeafletMap) {
    this.map = map;

    this.layers.push(this.mapService.getBaseLayer());
    this.mapService.load(this.layers);

    this.theZoom = map.getZoom();
  }

  onMapZoomEnd(event: LeafletEvent) {
    this.theZoom = event.target.getZoom();
    this.log.debug('Zoom set to', this.theZoom);
  }

  resetMap() {
    this.map!.flyTo(centerOfEurope, defaultZoom);
  }
}
