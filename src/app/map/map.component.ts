import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { latLng, Layer, LeafletEvent, Map as LeafletMap, MapOptions } from 'leaflet';
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
    fadeAnimation: true,
    zoomAnimation: true,
    markerZoomAnimation: true,
    zoomSnap: 0.25,
    zoomDelta: 0.25
  };

  layers: Layer[] = [];

  private map?: LeafletMap;
  private theZoom?: number;
  private onReset?: Subscription;
  private onToMyLocation?: Subscription;

  constructor(
    private log: NGXLogger,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.onReset = this.mapService.resetMap.subscribe(() => {
      this.resetMap();
    });

    this.onToMyLocation = this.mapService.toMyLocation.subscribe(() => {
      this.myLocation();
    });
  }

  ngOnDestroy(): void {
    this.onReset!.unsubscribe();
    this.onToMyLocation!.unsubscribe();

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
    // TODO clear my location marker
  }

  myLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.map!.flyTo(latLng(position.coords.latitude, position.coords.longitude), defaultZoom + 2, {
          animate: true,
          duration: 1
        });
      },
      err => {
        this.log.error('Could not get geolocation', err);

        // TODO error notification toast
      }
    );
  }
}
