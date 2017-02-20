import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {AppModule} from "./app.module";

var adminLTE = require('adminLTE');

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(success => console.log("Bootstrap success main"))
  .catch(error => console.log(error));

