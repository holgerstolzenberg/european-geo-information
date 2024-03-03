import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class I18nService {
  constructor(private readonly translocoService: TranslocoService) {}

  getActiveLang() {
    return this.translocoService.getActiveLang();
  }

  translate(key: string) {
    return this.translocoService.selectTranslate<string>(key);
  }

  setActiveLang(languageCode: string) {
    this.translocoService.setActiveLang(languageCode);
  }
}
