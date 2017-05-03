import { Headers } from '@angular/http';


let moment = require('moment');
export const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');
contentHeaders.append('x-TimeZone',moment().format('Z').replace(':',''));

if(localStorage.getItem('bearer'))
    contentHeaders.append('Authorization', 'Bearer '+localStorage.getItem('bearer'));
