import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {AngularFireModule} from 'angularfire2';
import {TranslateLoader,TranslateStaticLoader,TranslateModule} from 'ng2-translate';
import './rxjs-extensions';

import {AppRoutingModule, componentsApp, componentsDefault, componentsView} from './app-routing.module';
import {globalService} from "./com.zippyttech.utils/globalService";
import {AppComponent} from "./com.zippyttech.init/app/app.component";
import {LocationStrategy,HashLocationStrategy} from "@angular/common";
import {directivesApp, directivesDefault} from "./app.directives";
import {QRCodeModule} from "angular2-qrcode/angular2-qrcode";
import {WebSocket} from "./com.zippyttech.utils/websocket";
import {DependenciesBase} from "./com.zippyttech.common/DependenciesBase";
import {ChartModule} from "angular2-highcharts";

var firebase = require('firebase');

const myFirebaseConfig = {
    apiKey: "AIzaSyD7yBfAAGV9pSCHqkqJXGW2g6R70209Kl4",
    authDomain: "club-de-golf-80558.firebaseapp.com",
    databaseURL: "https://club-de-golf-80558.firebaseio.com",
    storageBucket: "club-de-golf-80558.appspot.com",
    messagingSenderId: "409370883490"
};

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpModule,
        ChartModule,
        QRCodeModule,
        AngularFireModule.initializeApp(myFirebaseConfig),
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
            deps: [Http]
        }),
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
        WebSocket,
        {provide:LocationStrategy,useClass: HashLocationStrategy},
        DependenciesBase,
        globalService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
