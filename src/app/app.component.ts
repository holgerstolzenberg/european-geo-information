import {Component, OnInit} from '@angular/core';
import {TranslocoService} from "@ngneat/transloco";
import {NGXLogger} from "ngx-logger";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.sass'
})
export class AppComponent implements OnInit {
  constructor(
    private i18nService: TranslocoService,
    private logger: NGXLogger,
    private title: Title
  ) {
    this.logger.info('Active lang: ' + this.i18nService.getActiveLang());
  }

  ngOnInit(): void {
    this.i18nService
      .selectTranslate('header.title')
      .subscribe(value => this.title.setTitle(value));
  }
}
