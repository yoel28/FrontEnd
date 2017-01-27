import {Component, OnInit} from '@angular/core';
import {RestController} from "../../../com.zippyttech.rest/restController";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
@Component({
    selector: 'card-view',
    templateUrl: SystemJS.map.app+'/com.zippyttech.ui/components/card/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.ui/components/card/style.css'],
    inputs: ['rules', 'dataList','params'],
})
export class CardComponent extends RestController{


}
