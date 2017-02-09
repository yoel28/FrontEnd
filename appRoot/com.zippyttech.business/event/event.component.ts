import {Component} from '@angular/core';
import {EventModel} from "./event.model";
import {BaseViewInstance} from "../../com.zippyttech.ui/view/base/baseView.instance";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;

@Component({
    selector: 'event',
    templateUrl:SystemJS.map.app+'/com.zippyttech.ui/view/base/base.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/view/base/style.css'],
})
export class EventComponent extends BaseViewInstance{

    constructor(public db:DependenciesBase) {
        super();
    }
    initModel() {
        this.model= new EventModel(this.db);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Eventos';
    }
    loadTableActions(){
        this.tableActions={};
        this.tableActions["delete"] = {
            message: '¿ Esta seguro de eliminar el evento : ',
            keyAction:'code'
        };
    }

}

