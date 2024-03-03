import { Component } from '@angular/core';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrl: 'toolbar.component.scss'
})
export class ToolbarComponent {
  constructor(private mapService: MapService) {}

  resetMap() {
    this.mapService.resetMapToEuropeanCenter();
  }

  toMyLocation() {
    this.mapService.moveMapToMyLocation();
  }
}
