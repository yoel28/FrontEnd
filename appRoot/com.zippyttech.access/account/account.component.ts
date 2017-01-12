import {Component} from '@angular/core';
import {AccountModel} from "./account.model";
import {BaseViewInstance} from "../../com.zippyttech.ui/view/base/baseView.instance";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
@Component({
    selector: 'account',
    templateUrl:SystemJS.map.app+'/com.zippyttech.ui/view/base/base.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/view/base/style.css'],
})
export class AccountComponent extends BaseViewInstance{

    constructor(public db:DependenciesBase) {
        super();
    }

    initModel():any {
        this.model= new AccountModel(this.db);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Cuentas';
    }
    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar la cuenta: ',
            'keyAction':'authority'
        };
    }
}