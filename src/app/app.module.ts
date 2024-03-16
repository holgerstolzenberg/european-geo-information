import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserModule } from '@angular/platform-browser';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MapComponent } from './map/map.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { OptionPaneComponent } from './option-pane/option-pane.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { I18nModule } from './i18n/i18n.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MapModule } from './map/map.module';
import { MatSlider, MatSliderModule, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { LoggingModule } from './logging/logging.module';

@NgModule({
  declarations: [HeaderComponent, ToolbarComponent, MapComponent, AppComponent, OptionPaneComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSlider,
    MatSliderThumb,
    MatIcon,
    MatButton,
    MatSlideToggle,
    LoggingModule,
    I18nModule,
    NotificationsModule,
    MapModule,
    FormsModule
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule {}
