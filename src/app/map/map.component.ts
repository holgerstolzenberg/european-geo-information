import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  CircleMarker,
  control,
  GeoJSON,
  latLng,
  Layer,
  LayerGroup,
  LeafletEvent,
  Map as LeafletMap,
  MapOptions
} from 'leaflet';
import { MapService } from './map.service';
import { NGXLogger } from 'ngx-logger';
import {
  attributionOptions,
  centerOfEurope,
  defaultCapitolsStyle,
  defaultZoom,
  defaultZoomPanOptions,
  euBorderStyle,
  LayerIndices,
  noDrawStyle
} from './map.constants';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
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
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    attributionControl: false
  };

  layers: Promise<Layer[]>;
  showLoader: boolean = false;

  private theMap?: LeafletMap;
  private theZoom?: number;

  private onUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private log: NGXLogger,
    private mapService: MapService
  ) {
    this.layers = this.loadAllLayers();
  }

  ngOnInit(): void {
    this.mapService.resetMap$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(() => {
      this.resetMap();
    });

    this.mapService.toMyLocation$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(() => {
      this.myLocation();
    });

    this.mapService.showEuBorders$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(value => {
      this.showEuBorders(value);
    });

    this.mapService.showCapitols$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(value => {
      this.showCapitols(value);
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
    this.theMap!.clearAllEventListeners();
    this.theMap!.remove();
    this.log.info('Disposed theMap');
  }

  onMapReady(map: LeafletMap) {
    this.theMap = map;
    this.log.info('Leaflet theMap ready');
    this.theMap.addControl(control.attribution(attributionOptions));
    this.theZoom = map.getZoom();
  }

  private async loadAllLayers() {
    return this.mapService.loadAllLayers().then(([baseLayer, euBorderLayer, capitolsLayer]) => {
      const layers = new Array<Layer>(3);
      layers[LayerIndices.BASE_LAYER_INDEX] = baseLayer;
      layers[LayerIndices.EU_LAYER_INDEX] = euBorderLayer;
      layers[LayerIndices.CAPITOLS_LAYER_INDEX] = capitolsLayer;

      return layers;
    });
  }

  onMapZoomStart() {
    this.log.debug('MapZoomStart: zoom set to', this.theZoom);
    this.showLoader = true;
  }

  onMapZoomEnd(event: LeafletEvent) {
    this.theZoom = event.target.getZoom();
    this.log.debug('MapZoomEnd: zoom set to', this.theZoom);
    this.showLoader = false;
  }

  resetMap() {
    this.theMap!.flyTo(centerOfEurope, defaultZoom);
    // TODO clear my location marker
  }

  myLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.theMap!.flyTo(
          latLng(position.coords.latitude, position.coords.longitude),
          defaultZoom + 2,
          defaultZoomPanOptions
        );
      },
      err => {
        this.log.error('Could not get geolocation', err);

        // TODO error notification toast
      }
    );
  }

  private showEuBorders(value: boolean) {
    this.layers
      .then(layer => {
        return layer[LayerIndices.EU_LAYER_INDEX] as GeoJSON;
      })
      .then(l => l.setStyle(value ? euBorderStyle : noDrawStyle));
  }

  private showCapitols(value: boolean) {
    this.theMap!.closePopup();

    this.layers
      .then(layer => {
        return layer[LayerIndices.CAPITOLS_LAYER_INDEX] as LayerGroup;
      })
      .then(capitols => capitols.getLayers().forEach(capitol => this.markerVisible(capitol, value)));
  }

  private markerVisible(layer: Layer, visible: boolean) {
    (layer as CircleMarker).setStyle(visible ? defaultCapitolsStyle : noDrawStyle);
  }
}
