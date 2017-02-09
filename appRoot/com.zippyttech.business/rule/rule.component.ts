import {Component} from '@angular/core';
import {RuleModel} from "./rule.model";
import {BaseViewInstance} from "../../com.zippyttech.ui/view/base/baseView.instance";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
@Component({
    selector: 'rule',
    templateUrl:SystemJS.map.app+'/com.zippyttech.ui/view/base/base.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/view/base/style.css'],
})
export class RuleComponent extends BaseViewInstance{

   constructor(public db:DependenciesBase) {
       super();
    }
    initModel() {
        this.model= new RuleModel(this.db);
    }

    initViewOptions() {
        this.viewOptions["title"] = 'Reglas';
    }

    loadTableActions(){
        this.tableActions={};
        this.tableActions["delete"] = {
            message: '¿ Esta seguro de eliminar la regla: ',
            keyAction:'code'
        };
    }
}