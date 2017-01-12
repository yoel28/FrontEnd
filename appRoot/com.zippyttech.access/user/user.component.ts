import {Component} from '@angular/core';
import {UserModel} from "./user.model";
import {BaseViewInstance} from "../../com.zippyttech.ui/view/base/baseView.instance";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
@Component({
    selector: 'user',
    templateUrl:SystemJS.map.app+'/com.zippyttech.ui/view/base/base.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/view/base/style.css'],
})
export class UserComponent extends BaseViewInstance{

    constructor(public db:DependenciesBase) {
       super();
    }
    initModel():any {
        this.model= new UserModel(this.db);
    }

    initViewOptions() {
        this.viewOptions["title"] = 'Usuarios';
    }
    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar el usuario : ',
            'keyAction':'username'
        };
    }
}