import {Component} from '@angular/core';
import {NotificationModel} from "./notification.model";
import {BaseViewInstance} from "../../com.zippyttech.ui/view/base/baseView.instance";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;

@Component({
    selector: 'notification',
    templateUrl:SystemJS.map.app+'/com.zippyttech.ui/view/base/base.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/view/base/style.css'],

})
export class NotificationComponent extends BaseViewInstance{

    constructor(public db:DependenciesBase) {
        super();
    }
    initModel() {
        this.model= new NotificationModel(this.db);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Notificaciones';
    }

    loadTableActions(){
        this.tableActions={};
        this.tableActions["delete"] = {
            message: '¿ Esta seguro de eliminar la accion : ',
            keyAction:'title'
        };
    }
}

