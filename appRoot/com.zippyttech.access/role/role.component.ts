import {Component} from '@angular/core';
import {RoleModel} from "./role.model";
import {BaseViewInstance} from "../../com.zippyttech.ui/view/base/baseView.instance";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
@Component({
    selector: 'role',
    templateUrl:SystemJS.map.app+'/com.zippyttech.ui/view/base/base.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/view/base/style.css'],
})
export class RoleComponent extends BaseViewInstance{

    constructor(public db:DependenciesBase) {
        super();
    }
    initModel():any {
        this.model= new RoleModel(this.db);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Roles';
    }
    loadTableActions(){
        this.tableActions={};
        this.tableActions["delete"] = {
            message: '¿ Esta seguro de eliminar el rol : ',
            keyAction:'authority'
        };
    }
}