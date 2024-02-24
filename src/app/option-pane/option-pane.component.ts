import { Component } from '@angular/core';

@Component({
  selector: 'app-option-pane',
  templateUrl: 'option-pane.component.html',
  styleUrl: 'option-pane.component.sass'
})
export class OptionPaneComponent {
  expanded: boolean = false;

  constructor() {}

  protected expand() {
    this.expanded = true;
  }

  protected compress() {
    this.expanded = false;
  }
}
