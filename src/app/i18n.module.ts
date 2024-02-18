import { provideTransloco, TranslocoModule } from '@ngneat/transloco';
import { isDevMode, NgModule } from '@angular/core';
import { I18nHttpLoader } from './utils/I18nHttpLoader';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslocoPreloadLangs } from '@ngneat/transloco-preload-langs';

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
      loader: I18nHttpLoader
    }),
    provideTranslocoPreloadLangs(['en', 'de'])
  ]
})
export class I18nModule {
  // nothing here so far
}
