import {Component} from '@angular/core';
import {TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.sass'
})
export class HeaderComponent {
  constructor(private i18nService: TranslocoService) {
  }

  switchLanguageTo(languageCode: string) {
    if (!languageCode) {
      return;
    }

    console.log('Language selected: ' + languageCode);
    this.i18nService.setActiveLang(languageCode);
  }

  isActive(lang: string): boolean {
    if (!lang) {
      return false;
    }

    return lang == this.i18nService.getActiveLang();
  }
}
