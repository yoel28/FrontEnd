import {
    Component, OnInit, HostBinding, trigger, state, style, transition, animate, EventEmitter,
    AfterViewInit
} from '@angular/core';
import {ControllerBase} from "../../../com.zippyttech.common/ControllerBase";
import {AnimationsManager} from "../../animations/AnimationsManager";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {TablesComponent} from "../../components/tables/tables.component";


declare var SystemJS:any;
@Component({
    selector: 'base-view',
    templateUrl: SystemJS.map.app + '/com.zippyttech.ui/view/base/index.html',
    styleUrls: [SystemJS.map.app + '/com.zippyttech.ui/view/base/style.css'],
    inputs: ['instance'],
    outputs:['getInstance'],
    animations: AnimationsManager.getTriggers("d-slide_up|fade-fade",200)
})
export class BaseViewComponent extends ControllerBase implements OnInit,AfterViewInit {
    public instance:any;
    public dataSelect:any = {};
    public paramsTable:any={};
    public getInstance:any;


    constructor(public db:DependenciesBase) {
        super(db);
        this.getInstance = new EventEmitter();
    }
    ngOnInit(){
        super.ngOnInit();
        this.initViewOptions();
        this.loadParamsTable();
        this.loadPage();
    }
    ngAfterViewInit(){
        this._getInstance();
    }
    initModel() {
        this.model = this.instance.model;
    }

    public instanceTable:any;
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
    loadParamsTable(){
        this.paramsTable.actions={};

        if(this.instance.paramsTable && this.instance.paramsTable.actions )
        {
            if(this.instance.paramsTable.actions.delete){
                this.paramsTable.actions.delete = {
                    "icon": "fa fa-trash",
                    "exp": "",
                    'title': 'Eliminar',
                    'idModal': this.model.prefix+'_'+this.configId+'_DEL',
                    'permission': this.model.permissions.delete,
                    'message': this.instance.paramsTable.actions.delete.message,
                    'keyAction':this.instance.paramsTable.actions.delete.keyAction
                };
            }

            if(this.instance.paramsTable.actions.viewHistory){
                this.paramsTable.actions.viewHistory = this.instance.paramsTable.actions.viewHistory;
            }

        }

    }

    getUrlExport(type:string){
        if(this.instanceTable)
        return  localStorage.getItem('urlAPI')+
                this.model.endpoint +
                this.model.getRestParams()+
                '&access_token='+localStorage.getItem('bearer')+
                '&formatType='+type;
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
    public _getInstance(){
        this.getInstance.emit(this);
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
    savePreference(){
        let that = this;
        this.db.myglobal.setPreferenceViewModel(this.model.constructor.name,this.model.rules);
        let successCallback = (response)=>{
            that.model.addToast('Notificación','Preferencias guardadas')
        }
        this.model.onPatchProfile('preferences',this.db.myglobal.user,this.db.myglobal.user.preferences);
    }
    evalExp(exp){
        return eval(exp);
    }

}

