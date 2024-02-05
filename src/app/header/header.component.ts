import {Component} from '@angular/core';
import {TranslocoService} from "@ngneat/transloco";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.sass'
})
export class HeaderComponent {
  constructor(private i18nService: TranslocoService, private logger: NGXLogger) {
  }

  switchLanguageTo(languageCode: string) {
    if (!languageCode) {
      return;
    }

    this.i18nService.setActiveLang(languageCode);
    this.logger.log('Language set: ' + languageCode);
  }

  isActive(lang: string): boolean {
    if (!lang) {
      return false;
    }

    return lang == this.i18nService.getActiveLang();
  }
}
