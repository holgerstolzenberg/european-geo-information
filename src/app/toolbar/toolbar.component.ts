import { Component, inject } from '@angular/core';
import { MapService } from '../map/map.service';
import { NGXLogger } from 'ngx-logger';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrl: 'toolbar.component.scss',
  imports: [
    MatIcon,
    TranslocoPipe,
    MatButton
  ]
})
export class ToolbarComponent {
  private log = inject(NGXLogger);
  private mapService = inject(MapService);

  constructor() {}

  resetMap() {
    this.mapService.resetMapToEuropeanCenter().then(() => this.log.debug('Map has been reset'));
  }

  toMyLocation() {
    this.mapService.moveMapToMyLocation().then(() => this.log.debug('Moved map to my location'));
  }
}
