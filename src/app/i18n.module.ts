import {provideTransloco, TranslocoModule} from '@ngneat/transloco';
import {isDevMode, NgModule} from '@angular/core';
import {TranslocoHttpLoader} from "./utils/TranslocoHttpLoader";
import {provideHttpClient} from "@angular/common/http";

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    }),
  ],
})
export class I18nModule {
  // nothing here so far
}