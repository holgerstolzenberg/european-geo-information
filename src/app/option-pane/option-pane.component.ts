import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-option-pane',
  templateUrl: 'option-pane.component.html',
  styleUrl: 'option-pane.component.scss'
})
export class OptionPaneComponent {
  expanded: boolean = true;
  showEuBorders: boolean = true;
  showBerlin: boolean = true;

  constructor(private log: NGXLogger) {}

  protected expand() {
    this.expanded = true;
  }

  protected compress() {
    this.expanded = false;
  }

  euBordersChanged() {
    this.log.debug('EU border changed');
  }

  berlinChanged() {
    this.log.debug('Berlin changed');
  }
}
