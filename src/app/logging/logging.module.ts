import { NgModule } from '@angular/core';
import { LoggingService } from './logging.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from '../../environments/environment';

@NgModule({
  exports: [],
  imports: [
    LoggerModule.forRoot({
      level: environment.prodMode ? NgxLoggerLevel.WARN : NgxLoggerLevel.DEBUG
    })
  ],
  providers: [
    LoggingService
  ]
})
export class LoggingModule {
  // nothing here so far
}
