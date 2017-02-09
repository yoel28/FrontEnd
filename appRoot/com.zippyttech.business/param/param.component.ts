import {Component} from '@angular/core';
import {ParamModel} from "./param.model";
import {BaseViewInstance} from "../../com.zippyttech.ui/view/base/baseView.instance";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
@Component({
    selector: 'params',
    templateUrl:SystemJS.map.app+'/com.zippyttech.ui/view/base/base.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/view/base/style.css'],
})
export class ParamComponent extends BaseViewInstance{

    constructor(public db:DependenciesBase) {
        super();
    }
    initModel() {
        this.model= new ParamModel(this.db);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Parámetros';
    }

    loadTableActions(){
        this.tableActions={};
        this.tableActions["delete"] = {
            message: '¿ Esta seguro de eliminar el parámetro : ',
            keyAction:'code'
        };
    }
}