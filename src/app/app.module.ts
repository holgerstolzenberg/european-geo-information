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
import { MatButton } from '@angular/material/button';
import { environment } from '../environments/environment';
import { OptionPaneComponent } from './option-pane/option-pane.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [HeaderComponent, ToolbarComponent, MapComponent, AppComponent, OptionPaneComponent],
  imports: [
    I18nModule,
    LoggerModule.forRoot({
      level: environment.prodMode ? NgxLoggerLevel.WARN : NgxLoggerLevel.DEBUG
    }),
    BrowserModule,
    LeafletModule,
    MatIcon,
    MatButton,
    MatSlideToggle
  ],
  providers: [provideAnimationsAsync(), MapService],
  bootstrap: [AppComponent]
})
export class AppModule {}
