import { Component } from '@angular/core';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrl: 'toolbar.component.sass'
})
export class ToolbarComponent {
  constructor(private mapService: MapService) {}

  resetMap() {
    this.mapService.onResetMap();
  }
}
