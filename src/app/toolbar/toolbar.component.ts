import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrl: 'toolbar.component.sass'
})
export class ToolbarComponent {
  constructor(private log: NGXLogger) {}

  updatePosition() {
    this.log.info('Rest map to your position');

    // TODO impl
  }
}
