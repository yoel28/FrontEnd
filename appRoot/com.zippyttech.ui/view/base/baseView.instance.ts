import {OnInit, EventEmitter, AfterViewInit} from '@angular/core';
import {IRest} from "../../../com.zippyttech.rest/restController";
import {BaseViewComponent} from "./baseView.component";

export abstract class BaseViewInstance  implements OnInit,AfterViewInit {

    public viewActions:boolean=true;
    public getInstance:any;
    public instanceBase:BaseViewComponent;
    public instance:any={};
    public paramsTable:any={};
    public model:any;
    public viewOptions:any={};

    constructor() {
        this.getInstance = new EventEmitter();
    }

    abstract initModel();
    abstract initViewOptions();
    abstract loadParamsTable();

    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();
        this._loadInstance();
    }
    ngAfterViewInit():void{
        this._getInstance();
    }

    protected _loadInstance(){
        this.viewOptions['viewActions']=this.viewActions;

        this.instance = {
            'model':this.model,
            'viewOptions':this.viewOptions,
            'paramsTable':this.paramsTable,
        };
    }

    protected _getInstance(){
        this.getInstance.emit(this);
    }
    public setInstance(instance:BaseViewComponent){
        this.instanceBase = instance;
    }

}
