import { provideTransloco, TranslocoModule } from '@ngneat/transloco';
import { isDevMode, NgModule } from '@angular/core';
import { I18nHttpLoaderService } from './i18n-http-loader.service';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslocoPreloadLangs } from '@ngneat/transloco-preload-langs';
import { I18nService } from './i18n.service';

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode()
      },
      loader: I18nHttpLoaderService
    }),
    provideTranslocoPreloadLangs(['en', 'de']),
    I18nService
  ]
})
export class I18nModule {
  // nothing here so far
}
