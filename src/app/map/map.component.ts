import {Component, OnInit} from '@angular/core';
import {Layer, MapOptions} from 'leaflet'
import {MapService} from "./map.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.sass'
})
export class MapComponent implements OnInit {
  options: MapOptions = {
    zoom: 4,
    minZoom: 3,
    maxZoom: 20,
    center: this.mapService.getCenterOfEurope()
  }

  layers: Layer[] = [];

  constructor(private mapService: MapService) {
  }

  ngOnInit(): void {
    this.layers.push(this.mapService.getBaseLayer());
    this.mapService.load(this.layers);
  }
}
