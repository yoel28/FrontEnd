import {OnInit, EventEmitter, AfterViewInit} from '@angular/core';
import {IRest} from "../../../com.zippyttech.rest/restController";
import {BaseViewComponent} from "./baseView.component";
import {ITableActions} from "../../components/tables/tables.component";

export abstract class BaseViewInstance  implements OnInit,AfterViewInit {

    public viewActions:boolean=true;
    public getInstance:any;
    public instanceBase:BaseViewComponent;
    public instance:any={};
    public tableActions:ITableActions;
    public model:any;
    public viewOptions:any={};
    public rest:IRest={
        where:[],
        max:15,
        offset:0,
    };
    constructor() {
        this.getInstance = new EventEmitter();
    }

    abstract initModel();
    abstract initViewOptions();
    abstract loadTableActions();

    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadTableActions();
        this._loadWhereInParamsFilter();
        this._loadInstance();
    }
    ngAfterViewInit():void{
        this._getInstance();
    }

    protected _loadInstance(){
        this.viewOptions['viewActions']=this.viewActions;
        this.model.rest = this.rest;

        this.instance = {
            'model':this.model,
            'viewOptions':this.viewOptions,
            'tableActions':this.tableActions,
        };
    }
    protected _loadWhereInParamsFilter(){
        this.model.paramsSearch.where = this.rest.where;
    }

    protected _getInstance(){
        this.getInstance.emit(this);
    }
    public setInstance(instance:BaseViewComponent){
        this.instanceBase = instance;
    }

}
