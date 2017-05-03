import {Component, EventEmitter, OnInit} from "@angular/core";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {IRuleView} from "../ruleView/ruleView.component";
import {Rule} from "../../../com.zippyttech.common/rules/rule";
import {TRules} from "../../../app-routing.module";
import {ModelRoot} from "../../../com.zippyttech.common/modelRoot";

let moment = require('moment');

@Component({
    selector: 'tables-view',
    templateUrl: './index.html',
    styleUrls: ['./style.css'],
    inputs:['model','viewActions'],
    outputs:['getInstance'],
})
export class TablesComponent implements OnInit {

    public model:ModelRoot;
    private viewActions:boolean = true;

    public paramsData:IRuleView={
        select:{},
        searchParams:{},
        searchInstances:{},
        viewListData:{},
        ruleReference:{},
        arrayData:[]
    };

    public getInstance:any;
    private _currentPage: number;

    constructor(public db:DependenciesBase) {
        this._currentPage = -1;
        this.getInstance = new EventEmitter();
    }

    ngOnInit() {
        this.getListObjectNotReferenceSave();
    }

    ngAfterViewInit() {
        this.getInstance.emit(this);
    }
    private getRule(key:string):TRules{
        return this.model.rules[key] || {};
    }

    public get currentPage(){
        if(this._currentPage = -1)
            this._currentPage = (this.model.rest.offset/this.model.rest.max)+1;
        return this._currentPage;
    }

    public set currentPage(value:number){
        this._currentPage = value;
        this.model.loadData(value);
    }

    setInstanceSearch(type,instance){
        this.paramsData.searchInstances[type] =  instance;
    }

    private get keyVisible():string[]{
        let data=[];
        Object.keys(this.model.rules).forEach(key=>{
            if((<Rule>this.model.rules[key]).permissions.visible && (<Rule>this.model.rules[key]).include.list)
                data.push(key)
        });
        return data;
    }

    public modelSave:any={};
    getListObjectNotReferenceSave(){
        let that = this;
        Object.keys(this.model.rules).forEach(key=>{
            if(that.model.rules[key].object && !that.model.rules[key].reference && that.model.rules[key].permissions.add)
                that.modelSave[key]=that.model.rules[key];
        });
    }

    getDataSave(data,key){
        this.model.onPatch(this.modelSave[key].key,this.paramsData.select,data.id);
    }

    getDataSearch(data){
        this.model.onPatch(this.paramsData.searchParams['field'],this.paramsData.select,data.id);
    }

    getDataSearchMultiple(data){
        this.model.onPatch(this.paramsData.searchParams['field'],this.paramsData.select,data);
    }

    getObjectKeys(data){
        return Object.keys(data || {});
    }

    changeOrder(sort){
        if(sort && this.model && this.model.rules[sort] && (<Rule>this.model.rules[sort]).permissions['search']){
            this.model.changeOrder(sort);
        }
    }

    setDataFieldReference(data,setNull=false) {
        // let value=null;
        // let that = this;
        //
        // if(!setNull)//no colocar valor nulo
        // {
        //     value=this.paramsData.select['id'];
        //     if(that.paramsData.select[that.paramsData.ruleReference.code]!=null && that.paramsData.ruleReference.unique)
        //         that.paramsData.ruleReference.model.setDataField(that.paramsData.select[that.paramsData.ruleReference.code],that.model.ruleObject.key,null,that.paramsData.ruleReference.callback,that.paramsData.select).then(
        //             response=>{
        //                 that.paramsData.ruleReference.model.setDataField(data.id,that.model.ruleObject.key,value,that.paramsData.ruleReference.callback,that.paramsData.select);
        //             });
        //     else
        //         that.paramsData.ruleReference.model.setDataField(data.id,that.model.ruleObject.key,value,that.paramsData.ruleReference.callback,that.paramsData.select);
        // }
        // else
        //     that.paramsData.ruleReference.model.setDataField(data[that.paramsData.ruleReference.code],that.model.ruleObject.key,null,that.paramsData.ruleReference.callback,data);

    }

    // saveLocation(event){ TODO: Implementar nuevo
    //     if(event)
    //         event.preventDefault();
    //
    //     let json={};
    //     json[this.paramsData.locationParams.keys.lat] =  (this.paramsData.locationParams.data.lat).toString();
    //     json[this.paramsData.locationParams.keys.lng] =  (this.paramsData.locationParams.data.lng).toString();
    //
    //     this.model.onPatchObject(json,this.paramsData.select);
    //
    // }

    isUnique():boolean{
        //TODO: check view
        // if(this.model.getData().id || this.model.getData().count==1 || this.model.navIndex != null)
        // {
        //     if(this.model.navIndex == null)
        //         this.model.navIndex = "0";
        //     return true;
        // }
        return false;
    }

    public getNumber(value):number{
        return (value)?Number(value):0;
    }
}
