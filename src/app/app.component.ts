import {Component} from '@angular/core';
import {TranslocoService} from "@ngneat/transloco";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.sass'
})
export class AppComponent {
  constructor(
    private i18nService: TranslocoService,
    private logger: NGXLogger
  ) {
    this.logger.info('Active lang: ' + this.i18nService.getActiveLang());
  }
}
