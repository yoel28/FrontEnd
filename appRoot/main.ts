import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {AppModule} from "./app.module";
import {enableProdMode} from "@angular/core";

var adminLTE = require('adminLTE');
enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(success => console.log("Bootstrap success main"))
  .catch(error => console.log(error));

