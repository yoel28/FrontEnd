import {OnInit} from '@angular/core';
import {Rest} from "../../../com.zippyttech.rest/restController";

export abstract class BaseViewInstance  implements OnInit {

    public instance:any={};
    public paramsTable:any={};
    public model:any;
    public viewOptions:any={};
    public rest:Rest={
        where:[],
        max:15,
        offset:0,
    };

    abstract initModel();
    abstract initViewOptions();
    abstract loadParamsTable();

    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();

        this._loadInstance();
    }

    protected _loadInstance(){
        this.instance = {
            'model':this.model,
            'viewOptions':this.viewOptions,
            'paramsTable':this.paramsTable,
            'rest':this.rest
        };
    }

}
