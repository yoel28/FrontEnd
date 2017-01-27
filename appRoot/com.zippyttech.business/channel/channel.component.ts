import {Component} from '@angular/core';
import {ChannelModel} from "./channel.model";
import {BaseViewInstance} from "../../com.zippyttech.ui/view/base/baseView.instance";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;

@Component({
    selector: 'channel',
    templateUrl:SystemJS.map.app+'/com.zippyttech.ui/view/base/base.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/view/base/style.css'],

})
export class ChannelComponent extends BaseViewInstance{

    constructor(public db:DependenciesBase) {
        super();
    }
    initModel() {
        this.model= new ChannelModel(this.db);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Canales (WS)';
    }
    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar el canal : ',
            'keyAction':'code'
        };
    }
}

