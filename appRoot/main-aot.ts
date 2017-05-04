import {platformBrowser} from '@angular/platform-browser';

import {AppModuleNgFactory} from '../aot/AppModule/module.ngfactory';

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
    .then(success => console.log('Bootstrap success aot'))
    .catch(error => console.log(error));
