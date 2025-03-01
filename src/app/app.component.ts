import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { I18nService } from './core/i18n/i18n.service';
import { firstValueFrom } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MapComponent } from './map/map.component';
import { OptionPaneComponent } from './option-pane/option-pane.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    ToolbarComponent,
    MapComponent,
    OptionPaneComponent
  ],
  providers:[I18nService],
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private i18nService: I18nService,
    private logger: NGXLogger,
    private title: Title
  ) {
    this.logger.info('Active lang: ' + this.i18nService.getActiveLang());
  }

  ngOnInit(): void {
    firstValueFrom(this.i18nService.translate('header.title')).then(value => this.title.setTitle(value));
  }
}
