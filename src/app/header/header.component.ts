import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { I18nService } from '../i18n/i18n.service';
import { NgClass } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.scss',
  imports: [
    NgClass,
    TranslocoPipe
  ]
})
export class HeaderComponent {
  constructor(
    private i18nService: I18nService,
    private logger: NGXLogger
  ) {}

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
