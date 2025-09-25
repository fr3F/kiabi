import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

import { NgbNavModule, NgbAccordionModule, NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { ExtrapagesModule } from './extrapages/extrapages.module';

import { LayoutsModule } from './layouts/layouts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initFirebaseBackend } from './authUtils';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { FakeBackendInterceptor } from './core/helpers/fake-backend';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

if (environment.defaultauth === 'firebase') {
  initFirebaseBackend(environment.firebaseConfig);
} else {
  // tslint:disable-next-line: no-unused-expression
  FakeBackendInterceptor;
}

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

import { LOCALE_ID } from '@angular/core';

import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';

import localeFr from '@angular/common/locales/fr';
import { BaseComponentComponent } from './components/base-component/base-component.component';
import { BaseListComponent } from './components/base-list/base-list.component';
import { SafePipe } from './pipe/safe.pipe';
registerLocaleData(localeFr);
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxLoadingModule } from 'ngx-loading';
import { ListeInventaireComponent } from './components/inventaire/liste-inventaire/liste-inventaire.component';
import { DetailsInventaireComponent } from './components/inventaire/details-inventaire/details-inventaire.component';
import { InventaireModule } from './pages/inventaire/inventaire.module';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponentComponent,
    BaseListComponent,
 ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    LayoutsModule,
    AppRoutingModule,
    ExtrapagesModule,
    CarouselModule,
    NgbAccordionModule,
    NgbNavModule,
    NgbTooltipModule,
    ScrollToModule.forRoot(),
    NgbModule,
    FormsModule,
    DataTablesModule,
    InventaireModule,
    // NgxLoadingModule.forRoot({})
    // ToastrModule.forRoot()
    // ComponentsModule
    // CategoryaddModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
    {provide: LOCALE_ID, useValue: "fr-CA" }
  // { provide: LOCALE_ID, useValue: "fr-FR" }
  ],
  // exports: [FormComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
