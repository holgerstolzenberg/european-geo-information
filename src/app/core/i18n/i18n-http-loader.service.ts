import { Injectable, inject } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class I18nHttpLoaderService implements TranslocoLoader {
  private http = inject(HttpClient);

  constructor() {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`./assets/i18n/${lang}.json`);
  }
}
