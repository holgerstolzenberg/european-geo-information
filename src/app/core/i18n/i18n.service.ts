import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable()
export class I18nService {
  private readonly translocoService = inject(TranslocoService);

  constructor() {}

  getActiveLang() {
    return this.translocoService.getActiveLang();
  }

  translate(key: string) {
    return this.translocoService.selectTranslate<string>(key);
  }

  translateMultiple(keys: string[]) {
    return this.translocoService.selectTranslateObject(keys);
  }

  setActiveLang(languageCode: string) {
    this.translocoService.setActiveLang(languageCode);
  }
}
