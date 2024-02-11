import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserModule } from '@angular/platform-browser';
import { I18nModule } from './i18n.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapComponent } from './map/map.component';
import { MapService } from './map/map.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@NgModule({
  declarations: [HeaderComponent, ToolbarComponent, MapComponent, AppComponent],
  imports: [
    I18nModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.INFO
    }),
    LeafletModule,
    BrowserModule,
    MatIcon,
    MatIconButton
  ],
  providers: [provideAnimationsAsync(), MapService],
  bootstrap: [AppComponent]
})
export class AppModule {}