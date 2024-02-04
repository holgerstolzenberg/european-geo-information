import {NgModule} from '@angular/core';
import {AppComponent} from "./app.component";
import {HeaderComponent} from "./header/header.component";
import {BrowserModule, provideClientHydration} from "@angular/platform-browser";
import {I18nModule} from "./i18n.module";
import {ToolbarComponent} from "./toolbar/toolbar.component";

@NgModule({
  declarations: [
    HeaderComponent,
    ToolbarComponent,
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
