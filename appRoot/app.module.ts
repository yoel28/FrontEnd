import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {AppRoutingModule, componentsApp, componentsDefault, componentsView} from './app-routing.module';
import {AppComponent} from "./com.zippyttech.init/app/app.component";
import {LocationStrategy,HashLocationStrategy} from "@angular/common";
import {directivesApp, directivesDefault} from "./app.directives";
import {QRCodeModule} from "angular2-qrcode/angular2-qrcode";
import {DependenciesBase} from "./com.zippyttech.common/DependenciesBase";
import {ChartModule} from "angular2-highcharts";
import {ModalService} from "./com.zippyttech.services/modal/modal.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import './rxjs-extensions';

const myFirebaseConfig = {
    apiKey: "AIzaSyD7yBfAAGV9pSCHqkqJXGW2g6R70209Kl4",
    authDomain: "club-de-golf-80558.firebaseapp.com",
    databaseURL: "https://club-de-golf-80558.firebaseio.com",
    storageBucket: "club-de-golf-80558.appspot.com",
    messagingSenderId: "409370883490"
};

export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpModule,
        ChartModule,
        BrowserAnimationsModule,
        QRCodeModule,
        AngularFireModule.initializeApp(myFirebaseConfig),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        })
    ],
    declarations: [
        AppComponent,
        componentsApp,
        componentsDefault,
        componentsView,
        directivesApp,
        directivesDefault
    ],
    providers: [
        {provide:LocationStrategy,useClass: HashLocationStrategy},
        DependenciesBase,
        ModalService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
