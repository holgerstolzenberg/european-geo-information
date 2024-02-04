import {Component} from '@angular/core';
import {TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.sass'
})
export class AppComponent {
  constructor(private translocoService: TranslocoService) {
    console.log('Active lang: ' + translocoService.getActiveLang());
  }
}
