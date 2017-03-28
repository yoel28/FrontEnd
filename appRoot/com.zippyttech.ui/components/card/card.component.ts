import {Component} from '@angular/core';
import {RestController} from "../../../com.zippyttech.rest/restController";

@Component({
    selector: 'card-view',
    templateUrl: 'index.html',
    styleUrls: [ 'style.css'],
    inputs: ['rules', 'dataList','params'],
})
export class CardComponent extends RestController{


}
