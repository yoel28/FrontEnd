import {Component} from '@angular/core';
import {InfoModel} from "./info.model";
import {BaseViewInstance} from "../../com.zippyttech.ui/view/base/baseView.instance";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;

@Component({
    selector: 'info',
    templateUrl:SystemJS.map.app+'/com.zippyttech.ui/view/base/base.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/view/base/style.css'],

})
export class InfoComponent extends BaseViewInstance{

    constructor(public db:DependenciesBase) {
        super();
    }
    initModel() {
        this.model= new InfoModel(this.db);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Información (Ayudas)';
    }
    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar la acción : ',
            'keyAction':'code'
        };
    }
}

