import { Component, Input, inject } from '@angular/core';
import { MapService } from '../map/map.service';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { environment } from '../../environments/environment';
import { NGXLogger } from 'ngx-logger';
import { NgClass } from '@angular/common';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-option-pane',
  templateUrl: 'option-pane.component.html',
  styleUrl: 'option-pane.component.scss',
  imports: [
    NgClass,
    MatSlideToggle,
    MatSlider,
    TranslocoPipe,
    FormsModule,
    MatSliderThumb
  ]
})
export class OptionPaneComponent {
  private log = inject(NGXLogger);
  private mapService = inject(MapService);

  expanded: boolean = false;

  @Input() showEuBorders: boolean = true;
  @Input() showCapitols: boolean = true;

  @Input() mapPitch = environment.mapProperties.initialPitch;

  constructor() {}

  protected expand() {
    this.expanded = true;
  }

  protected compress() {
    this.expanded = false;
  }

  euBordersChanged(event: MatSlideToggleChange) {
    this.mapService.doShowEuBorders(event.checked).then(() => (this.showEuBorders = event.checked));
  }

  capitolsChanged(event: MatSlideToggleChange) {
    this.mapService.doShowCapitols(event.checked).then(() => (this.showCapitols = event.checked));
  }

  doPitchMap() {
    this.mapService.doPitchMap(this.mapPitch).then(() => {
      this.log.trace('Map pitched to: ', this.mapPitch);
    });
  }

  protected readonly onclick = onclick;
}
