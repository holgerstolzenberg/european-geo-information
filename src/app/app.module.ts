import {NgModule} from '@angular/core';
import {AppComponent} from "./app.component";
import {HeaderComponent} from "./header/header.component";
import {BrowserModule} from "@angular/platform-browser";
import {I18nModule} from "./i18n.module";
import {provideRouter, RouterOutlet} from "@angular/router";
import {routes} from "./app.routes";

@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent
  ],
  providers: [provideRouter(routes)],
  imports: [
    I18nModule,
    BrowserModule,
    RouterOutlet,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
