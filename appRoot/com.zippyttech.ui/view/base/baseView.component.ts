import {Component, OnInit,EventEmitter, AfterViewInit} from '@angular/core';
import {ControllerBase} from "../../../com.zippyttech.common/ControllerBase";
import {AnimationsManager} from "../../animations/AnimationsManager";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {TablesComponent} from "../../components/tables/tables.component";
import {IRule} from "../../../com.zippyttech.common/rules/rule";
import {API} from "../../../com.zippyttech.utils/catalog/defaultAPI";

let jQuery = require('jquery');
let moment = require('moment');

@Component({
    selector: 'base-view',
    templateUrl: './index.html',
    styleUrls: ['./style.css'],
    inputs: ['instance'],
    outputs:['getInstance'],
    animations: AnimationsManager.getTriggers("d-slide_up|fade-fade",200)
})
export class BaseViewComponent extends ControllerBase implements OnInit,AfterViewInit {

    public getInstance:any;
    private instance:any;

    constructor(public db:DependenciesBase) {
        super(db);
        this.getInstance = new EventEmitter();
    }
    ngOnInit(){
        super.ngOnInit();
        this.initViewOptions();
        this.loadPage();
    }
    ngAfterViewInit(){
        this.getInstance.emit(this);
    }
    initModel() {
        this.model = this.instance.model;
    }
    get getCurrentPage(){
        return ((this.model.getRest().offset/this.model.getRest().max)+1);
    }

    public instanceTable:TablesComponent;
    setInstance(instance:TablesComponent){
        this.instanceTable = instance;
    }
    initViewOptions() {
        this.viewOptions = this.instance.viewOptions;
        this.loadPreferenceViewModel();

    }
    private get isVisible():boolean{
        return !!this.model.getData().list;
    }

    getUrlExport(type:string){
        if(this.instanceTable)
        return  localStorage.getItem('urlAPI')+
                this.model.endpoint +
                this.model.getRestParams()+
                '&access_token='+localStorage.getItem('bearer')+
                '&formatType='+type+
                '&tz='+moment().format('Z').replace(':','');
    }
    public getEnabledReport(type='PDF'){
        if(type=='PDF')
            return (this.db.getParams('REPORT_LIMIT_ROWS_PDF',API.REPORT_LIMIT_ROWS_PDF) >= this.model.getData().count);
        if(type=='EXCEL')
            return ( this.db.getParams('REPORT_LIMIT_ROWS_EXCEL',API.REPORT_LIMIT_ROWS_XLS) >= this.model.getData().count);
    }

    setVisibleField(event,data:IRule)
    {
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        data.permissions.visible = ! data.permissions.visible;
    }
    private get getRulesList(){
        let keys=[];
        Object.keys(this.model.rules).forEach((i=>{
            if((<IRule>this.model.rules[i]).include.list){
                keys.push(i);
            }
        }).bind(this));
        return keys;
    }

    setCheckField(event,data){
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        data.check = !data.check;
    }
    changePosition(event,key,action){
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        let keys = this.getObjectKeys(this.model.rules);
        let index = keys.findIndex(obj=>obj==key);
        if( (index > 0 && action=='up') ||  (index < this.getObjectKeys(this.model.rules).length - 1) && action=='down' ){
            let temp={};
            let that=this;
            if(action == 'up'){
                keys[index]=keys[index-1];
                keys[index-1]= key;
            }
            else if(action == 'down'){
                keys[index]=keys[index+1];
                keys[index+1]= key;
            }
            keys.forEach(obj=>{
                temp[obj]=[];
                temp[obj] = that.model.rules[obj];
            });
            that.model.rules={};
            Object.assign(that.model.rules,temp);
        }
    }

    loadPreferenceViewModel(){
        let temp={};
        let current;
        current=this.db.myglobal.getPreferenceViewModel(this.model.constructor.name,this.model.rules);
        current.forEach((obj=>{
            temp[obj.key]=this.model.rules[obj.key];
            (<IRule>temp[obj.key]).permissions.visible = obj.visible;
        }).bind(this));
        this.model.rules={};
        Object.assign(this.model.rules,temp);
    }

    savePreference(reset=false){
        let that = this;
        this.db.myglobal.setPreferenceViewModel(this.model.constructor.name,this.model.rules,reset);
        let successCallback = (response)=>{
            that.model.httputils.addToast('Notificación','Preferencias guardadas')
        };
        this.model.onPatchProfile('preferences',this.db.myglobal.user,this.db.myglobal.user.preferences);
    }

    evalExp(exp){
        return eval(exp);
    }

}

