import {
  ApplicationConfig,
  enableProdMode,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection
} from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideTransloco } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { I18nHttpLoaderService } from './app/core/i18n/i18n-http-loader.service';
import { LoggingService } from './app/core/logging/logging.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MapService } from './app/map/map.service';
import { GeoService } from './app/map/geo.service';
import { NotificationService } from './app/core/notifications/notification.service';
import { ToastrModule } from 'ngx-toastr';
import { I18nService } from './app/core/i18n/i18n.service';

if (environment.prodMode) {
  enableProdMode();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(LoggerModule.forRoot({
      level: environment.prodMode ? NgxLoggerLevel.WARN : NgxLoggerLevel.DEBUG
    })),
    importProvidersFrom(ToastrModule.forRoot({ preventDuplicates: true, disableTimeOut: false })),
    LoggingService,
    I18nService,
    NotificationService,
    GeoService,
    MapService,
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode()
      },
      loader: I18nHttpLoaderService
    })
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
