import {Component} from '@angular/core';
import {PermissionModel} from "./permission.model";
import {BaseViewInstance} from "../../com.zippyttech.ui/view/base/baseView.instance";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
@Component({
    selector: 'permission',
    templateUrl:SystemJS.map.app+'/com.zippyttech.ui/view/base/base.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/view/base/style.css'],
})
export class PermissionComponent extends BaseViewInstance{

    constructor(public db:DependenciesBase) {
        super();
    }
    initModel() {
        this.model= new PermissionModel(this.db);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Permisos';
    }
    loadTableActions(){
        this.tableActions={};
        this.tableActions["delete"] = {
            message: '¿ Esta seguro de eliminar el permiso : ',
            keyAction:'code'
        };
    }
}