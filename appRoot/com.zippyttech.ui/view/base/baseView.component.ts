import {
    Component, OnInit, HostBinding, trigger, state, style, transition, animate, EventEmitter,
    AfterViewInit
} from '@angular/core';
import {ControllerBase} from "../../../com.zippyttech.common/ControllerBase";
import {AnimationsManager} from "../../animations/AnimationsManager";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {TablesComponent} from "../../components/tables/tables.component";

var jQuery = require('jquery');
var moment = require('moment');
@Component({
    moduleId:module.id,
    selector: 'base-view',
    templateUrl: 'index.html',
    styleUrls: ['style.css'],
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
        this.loadPage().then(()=>{
            this.model.refreshList();
        });
    }
    ngAfterViewInit(){
        this.getInstance.emit(this);
    }
    initModel() {
        this.model = this.instance.model;
    }
    get getCurrentPage(){
        return ((this.model.rest.offset/this.model.rest.max)+1);
    }

    public instanceTable:TablesComponent;
    setInstance(instance:TablesComponent){
        this.instanceTable = instance;
    }
    initViewOptions() {
        this.viewOptions = this.instance.viewOptions;
        this.viewOptions["buttons"] = [];

        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.add,
            'title': 'Agregar',
            'class': 'text-green',
            'icon': 'fa fa-plus',
            'type':'modal',
            'modal': this.model.paramsSave.idModal
        });
        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.filter && this.model.permissions.list,
            'title': 'Filtrar',
            'class': 'text-blue',
            'evalClass':'this.model.rest.where.length>0?"filter-enabled":""',
            'icon': 'fa fa-filter',
            'type':'modal',
            'modal': this.model.paramsSearch.idModal
        });
        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.list && this.model.permissions.showDelete,
            'title': 'Ver eliminados',
            'class': 'text-red',
            'type':'showDeleted',
            'icon': 'fa fa-trash'
        });

        this.loadPreferenceViewModel();

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
            return (parseFloat(this.db.myglobal.getParams('REPORT_LIMIT_ROWS_PDF')) >= this.model.dataList.count);
        if(type=='EXCEL')
            return (parseFloat(this.db.myglobal.getParams('REPORT_LIMIT_ROWS_EXCEL')) >= this.model.dataList.count);
    }

    setVisibleField(event,data)
    {
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        data.visible = ! data.visible;
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
            })
            that.model.rules={};
            Object.assign(that.model.rules,temp);
        }
    }
    loadPreferenceViewModel(){
        let that = this;
        let temp={};
        let current=[];
        current=this.db.myglobal.getPreferenceViewModel(this.model.constructor.name,this.model.rules);
        current.forEach(obj=>{
            temp[obj.key]=that.model.rules[obj.key];
            temp[obj.key].visible = obj.visible;
        });
        that.model.rules={};
        Object.assign(that.model.rules,temp);
    }
    savePreference(reset=false){
        let that = this;
        this.db.myglobal.setPreferenceViewModel(this.model.constructor.name,this.model.rules,reset);
        let successCallback = (response)=>{
            that.model.addToast('Notificación','Preferencias guardadas')
        }
        this.model.onPatchProfile('preferences',this.db.myglobal.user,this.db.myglobal.user.preferences);
    }
    evalExp(exp){
        return eval(exp);
    }

}

