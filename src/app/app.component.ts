import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { I18nService } from './i18n/i18n.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
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
