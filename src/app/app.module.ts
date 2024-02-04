import {NgModule} from '@angular/core';
import {AppComponent} from "./app.component";
import {HeaderComponent} from "./header/header.component";
import {BrowserModule, provideClientHydration} from "@angular/platform-browser";
import {I18nModule} from "./i18n.module";

@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent
  ],
  imports: [
    I18nModule,
    BrowserModule,
  ],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent]
})
export class AppModule {
}
