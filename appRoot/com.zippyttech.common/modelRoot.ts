import {StaticValues} from "../com.zippyttech.utils/catalog/staticValues";
import {RestController, IWhere, IRestEvent} from "../com.zippyttech.rest/restController";
import {DependenciesBase} from "./DependenciesBase";
import {Actions} from "../com.zippyttech.init/app/app.types";
import {OnInit} from "@angular/core";

var moment = require('moment');
var jQuery = require('jquery');

interface IDataActionParams{
    id?:string;
    message?: string;
}

interface IModelActionParams{
}

export interface IModelFilter{
    [key:string]:{
        view:[{
            title: string,
            icon: string,
            colorClass?: string;
            where:IWhere
        }],
        status:number,
        permission: boolean;
        callback(model?:ModelRoot);
    };
}

export abstract class ModelRoot extends RestController implements OnInit{
    public prefix = ((this.constructor.name).toUpperCase()).replace('MODEL','');
    public endpoint = "DEFAULT_ENDPOINT";
    public useGlobal:boolean=true;
    public completed=false;
    public permissions:any = {};
    public paramsSearch:any = {};
    public paramsSave:any = {};
    public ruleObject:any={};
    public rulesSave:any={};

    public dataActions:Actions<IDataActionParams>;
    public modelActions:Actions<IModelActionParams>;

    public filters:IModelFilter={};
    public display:string;

    private _currentData:any;
    public get currentData(){return this._currentData;};
    public set currentData(value){this._currentData = value;};

    public onEventDelete:(args:Object)=>void;
    public onEventSave:(args:Object)=>void;
    public configId = moment().valueOf();
    private rulesDefault:any = {};
    public rules:Object={};
    private _navIndex:number=null;


    constructor(public db:DependenciesBase,endpoint:string,useGlobal:boolean=true,prefix?:string){
        super(db);
        if(prefix)
            this.prefix = prefix;
        this.endpoint = endpoint;
        this.useGlobal = useGlobal;
        this.display = 'code';
        this.dataActions = new Actions<IDataActionParams>();
        this.modelActions = new Actions<IModelActionParams>();
        this._initModel();
    }

    ngOnInit(){
        this.events.subscribe((event)=>this.onEvent(event));
    }

    public set navIndex(value: number|string){
        if(value!=null) {
            let n = (typeof value == "string") ? Number(value) : this._navIndex + value;
            if(n < 0 && this.rest.offset+n > 0){
                this.loadData(this.rest.offset/this.rest.max).then(function(response){
                    this._navIndex = this.rest.max + n;
                    this.refreshData(this.dataList.list[this.navIndex]);
                }.bind(this));
            }
            else if(n > this.rest.max-1 && this.rest.offset+n < this.dataList.count){
                this.loadData(2+this.rest.offset/this.rest.max).then(function(response){
                    this._navIndex = n - this.rest.max;
                    this.refreshData(this.dataList.list[this.navIndex]);
                }.bind(this));
            }
            else if(n >= 0 &&  n <= this.rest.max-1 && this.rest.offset+n < this.dataList.count)
                this._navIndex = n;
            this.refreshData(this.dataList.list[this.navIndex]);
        }
        else this._navIndex = null;
    }
    public get navIndex(){ return this._navIndex; }

    private _initModel(){
        this._initPermissions();
        this._initRules();
        this._initParamsSearch();
        this._initParamsSave();
        this._initRuleObject();
        this._initDataActions();
        this._initModelActions();
    }
    public initModel(completed=true){
        this.initPermissions();
        this.modelExternal();
        this.initRules();
        this.initRulesSave();
        this.initParamsSearch();
        this.initParamsSave();
        this.initRuleObject();

        this.loadObjectRule();
        this.loadParamsSave();
        this.loadParamsSearch();

        this.addCustomField();

        this.db.ws.loadChannelByModel(this.constructor.name,this);
        this.removeRuleExtraSave();
        this.completed=completed;

        this.initDataActions();
        this.initModelActions();
    }

    abstract initPermissions();
    private _initPermissions() {
        this.permissions['exportPdf'] = this.db.myglobal.existsPermission([this.prefix + '_EXPORT_PDF']);
        this.permissions['exporXls'] = this.db.myglobal.existsPermission([this.prefix + '_EXPORT_XLS']);

        this.permissions['showAll'] = this.db.myglobal.existsPermission([this.prefix + '_SHOW_ALL']);
        this.permissions['showDelete'] = this.db.myglobal.existsPermission([this.prefix + '_SHOW_DELETED']);
        this.permissions['list'] = this.db.myglobal.existsPermission([this.prefix + '_LIST']);
        this.permissions['add'] = this.db.myglobal.existsPermission([this.prefix + '_ADD']);
        this.permissions['update'] = this.db.myglobal.existsPermission([this.prefix + '_UPDATE']);
        this.permissions['delete'] = this.db.myglobal.existsPermission([this.prefix + '_DELETE']);
        this.permissions['filter'] = this.db.myglobal.existsPermission([this.prefix + '_FILTER']);
        this.permissions['search'] = this.db.myglobal.existsPermission([this.prefix + '_SEARCH']);
        this.permissions['lock'] = this.db.myglobal.existsPermission([this.prefix + '_LOCK']);
        this.permissions['warning'] = this.db.myglobal.existsPermission([this.prefix + '_WARNING']);
        this.permissions['visible'] = true;//this.myglobal.existsPermission([this.prefix + '_VISIBLE']);
        this.permissions['audit'] = this.db.myglobal.existsPermission([this.prefix + '_AUDIT']);
        this.permissions['global'] = this.db.myglobal.existsPermission(['ACCESS_GLOBAL']) && this.useGlobal;
    }

    abstract initDataActions();
    private _initDataActions(){
        this.dataActions.add("view", {
            permission: this.permissions.list,
            views:[{ title: 'ver', icon: "fa fa-vcard" }],
            callback:function(data?,index?){
                this.currentData = data;
                this.navIndex = index;
            }.bind(this),
            stateEval:'0',
        });

        this.dataActions.add("enabled",{
            permission: this.permissions.lock && this.permissions.update,
            disabled:'!data.deleted',
            views: [
                {icon: "fa fa-lock", title: "Deshabilitado", colorClass:"text-red"},
                {icon: "fa fa-unlock", title: "Habilitado", colorClass:"text-green"}
            ],
            callback: function (data?, index?) {
                this.currentData = data;
                this.onLock('enabled', data);
            }.bind(this),
            stateEval:"data.enabled?1:0"
        });

        this.dataActions.add("editable",{
            permission: this.permissions.lock && this.permissions.update,
            disabled:'data.enabled && !data.deleted',
            views: [
                {icon: "fa fa-edit", title: "No Editable", colorClass:"text-red"},
                {icon: "fa fa-pencil", title: "Editable", colorClass:"text-green"},
            ],
            callback: function (data?, index?) {
                this.currentData = data;
                this.onLock('editable',data);
            }.bind(this),
            stateEval:'data.editable?1:0',
        });

        this.dataActions.add("visible",{
            permission: this.permissions.update && this.permissions.visible,
            disabled:'data.enabled && !data.deleted',
            views: [
                {icon: "fa fa-eye-slash", title: "Oculto", colorClass:"text-red"},
                {icon: "fa fa-eye", title: "Visible", colorClass:"text-green"}
            ],
            callback: function (data?, index?) {
                this.currentData = data;
                this.onPatch('visible',data);
            }.bind(this),
            stateEval:'data.visible?1:0',
        });

        this.dataActions.add("delete",{
            permission: this.permissions.delete,
            disabled:'data.enabled && data.editable && !data.deleted',
            views:[
                { icon: "fa fa-trash", title: 'Eliminar'}
            ],
            callback:((data?,index?)=>{
                this.currentData = data;
                this.db.ms.show("delete",{
                    model:this
                });
            }).bind(this),
            stateEval:'0',
            params:{
                message:'Seguro desea Eliminar'
            }
        });
    }

    abstract initModelActions();
    private _initModelActions(){
        this.modelActions.add( "add",{
            permission: this.permissions.add,
            views:[{ title: 'agregar', icon: "fa fa-plus", colorClass:'text-green'}],
            callback:((data?,index?)=>{
                alert('agregar no defined');
            }).bind(this),
            stateEval:'0',
            params:{}
        });

        this.modelActions.add("filter",{
            permission: this.permissions.filter,
            views: [ {icon: "fa fa-filter", title: "sin filtro", colorClass:"text-blue"},
                    {icon: "fa fa-filter", title: "filtrando" , colorClass:"text-green"}],
            callback: ((data?, index?)=>{
                alert('filter no defined');
            }).bind(this),
            stateEval:'0',
            params:{}
        });

        this.modelActions.add("showDelete", {
            permission: this.permissions.showDelete,
            views: [ {icon: "fa fa-trash", title: "Eliminados ocultos", colorClass:""},
                    {icon: "fa fa-trash", title: "Solo eliminados"   , colorClass:"text-red"},
                    {icon: "fa fa-trash", title: "Todo"   , colorClass:"text-yellow"}, ],
            callback: function (data?, index?){

            }.bind(this),
            stateEval:'0',
            params: {}
        });

        this.modelActions.add("refresh", {
            permission: this.permissions.update && this.permissions.visible,
            views: [ {icon: "fa fa-refresh", title: "Actualizar", colorClass:"text-blue"},
                    {icon: "fa fa-refresh fa-spin", title: "Actualizando", colorClass:"text-yellow"} ],
            callback: function (data?, index?) {

            }.bind(this),
            stateEval:'0',
            params: {}

        });

        this.modelActions.add("exportPdf",{
            permission: this.permissions.exportPdf,
            views:[{ icon: "fa fa-file-pdf", title: 'exportar como pdf', colorClass:"text-red" }],
            callback:((data?,index?)=>{

            }).bind(this),
            stateEval:'0',
            params: {}
        });

        this.modelActions.add("exporXls",{
            permission: this.permissions.exporXls,
            views:[{ icon: "fa fa-file-excel", title: 'exportar como excel', colorClass:"text-green" }],
            callback:((data?,index?)=>{

            }).bind(this),
            stateEval:'0',
            params: {}
        });
    }


    abstract modelExternal();
    abstract initRules();
    abstract initRulesSave();

    private _initRules() {
        this.rulesDefault["detail"] = {
            "update": this.permissions.update,
            "visible": this.permissions.visible,
            "search": this.permissions.filter,
            "showbuttons": true,
            "mode":"popup",
            'icon': 'fa fa-list',
            "type": "textarea",
            "key": "detail",
            "title": "Detalle",
            "placeholder": "Ingrese el detalle",
        };
        this.loadRulesExtra();

    }
    private loadRulesExtra(){
        this.setRuleId();
        this.setRuleIp();
        this.setRuleUserAgent();
        this.setRuleUsernameCreator();
        this.setRuleUsernameUpdater();
        this.setRuleDateCreated();
        this.setRuleDateUpdated();
    }

    setRuleId(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["id"] = {
                "update": false,
                "visible": this.permissions.visible,
                "search": this.permissions.filter,
                'icon': 'fa fa-list',
                "type": "number",
                "key": "id",
                "title": "ID",
                "placeholder": "Ingrese el ID",
            };
        }
    }
    setRuleIp(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["ip"] = {
                "update": false,
                "visible": false,
                "search": this.permissions.filter,
                'icon': 'fa fa-list',
                "type": "text",
                "key": "ip",
                "title": "IP",
                "placeholder": "Ingrese la IP",
            };
        }
    }
    setRuleUserAgent(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["userAgent"] = {
                "update": false,
                "visible": false,
                "search": this.permissions.filter,
                'icon': 'fa fa-list',
                "type": "text",
                "key": "userAgent",
                "title": "userAgent",
                "placeholder": "Ingrese el userAgent",
            };
        }
    }
    setRuleUsernameCreator(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["usernameCreator"] = {
                "update": false,
                "visible": false,
                "search": this.permissions.filter,
                'icon': 'fa fa-list',
                "type": "text",
                "key": "usernameCreator",
                "title": "Creador",
                "placeholder": "Ingrese el usuario creador",
            };
        }
    }
    setRuleUsernameUpdater(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["usernameUpdater"] = {
                "update": false,
                "visible": false,
                "search": this.permissions.filter,
                'icon': 'fa fa-list',
                "type": "text",
                "key": "usernameUpdater",
                "title": "Actualizador",
                "placeholder": "Ingrese el usuario que actualizo",
            };
        }
    }
    setRuleDateCreated(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["dateCreated"] = {
                "update": false,
                "visible": false,
                "search": this.permissions.filter,
                'icon': 'fa fa-list',
                "type": "combodate",
                "date":"datetime",
                "key": "dateCreated",
                "title": "Creación",
                "placeholder": "Ingrese la fecha de creación",
            };
        }
    }
    setRuleDateUpdated(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["dateUpdated"] = {
                "update": false,
                "visible": false,
                "search": this.permissions.filter,
                'icon': 'fa fa-list',
                "type": "combodate",
                "date":"datetime",
                "key": "dateUpdated",
                "title": "Actualización",
                "placeholder": "Ingrese la fecha de actualización",
            };
        }
    }

    private removeRuleExtraSave(){
        delete this.rulesSave['id'];
        delete this.rulesSave['ip'];
        delete this.rulesSave['userAgent'];
        delete this.rulesSave['usernameCreator'];
        delete this.rulesSave['usernameUpdater'];
        delete this.rulesSave['dateCreated'];
        delete this.rulesSave['dateUpdated'];
    }


    abstract initParamsSearch();
    private _initParamsSearch() {
        this.paramsSearch = {
            'title': 'Title Default',
            'permission': (this.permissions.search && this.permissions.list),
            'idModal': this.prefix + '_' + this.configId + '_search',
            'endpoint': "/search" + this.endpoint,
            'placeholder': "Placeholder default",
            'label': {'title': "título: ", 'detail': "detalle: "},
            'msg': {
                'errors': {
                    'noAuthorized': this.db.msg.noAuthorized,
                },
            },
            'where': [],
            'imageGuest': StaticValues.pathElements.isotipoMini,
            'field':'any',
            'count':0
        };
    }
    private loadParamsSearch(){
        this.paramsSearch.field = this.ruleObject.key+'.id';
    }

    abstract initParamsSave();
    private _initParamsSave() {
        this.paramsSave = {
            'title': 'Title Default',
            'updateField':false,
            'permission': this.permissions.add,
            'idModal': this.prefix + '_' + this.configId + '_add',
            'endpoint': this.endpoint,
            'customValidator':null,
            'onlyRequired':false,
            'customActions':[],
        };
    }

    abstract initRuleObject();
    private _initRuleObject() {
        this.ruleObject = {
            'icon': 'fa fa-list',
            'update':false,
            'search':false,
            "type": "text",
            "required":true,
            "visible":true,
            "key": "keyDefault",
            "keyDisplay": "keyDefault",
            "title": "TipoDefault",
            'object': true,
            'objectOrSave': null,
            'code': 'default',
            'prefix':'',
            "placeholder": "PlaceHolder default",
            'paramsSearch': {},
            "permissions": {},
            "rulesSave":{},
            "paramsSave":{}
        }
    }

    getRulesDefault(){
        return this.rulesDefault;
    }

    private loadObjectRule(){
        this.ruleObject.rulesSave = this.rulesSave;
        this.ruleObject.paramsSave = this.paramsSave;
        this.ruleObject.permissions = this.permissions;
        this.ruleObject.paramsSearch = this.paramsSearch;
        this.ruleObject.prefix = this.prefix;
        this.ruleObject.search = this.permissions.search;

    }
    private loadParamsSave(){
        this.paramsSave.prefix = this.prefix+'_ADD';
    }

    public extendRulesObjectInRules(rules){
        let that = this;

        Object.keys(rules).forEach(key=>{
            if(rules[key].object){
                Object.keys(rules[key].rulesSave).forEach(subKey=>{
                    rules[key+that.capitalizeFirstLetter(subKey)] = rules[key].rulesSave[subKey];
                    rules[key+that.capitalizeFirstLetter(subKey)].search=false;
                })
            }
        })
    }
    public capitalizeFirstLetter (data) {
        return data.charAt(0).toUpperCase() + data.slice(1);
    }
    public addCustomField(){
        let that = this;
        Object.keys(this.rules).forEach(key=>{
            that.rules[key].check =  false;
        });
    }
    public spliceId(id:string)
    {
        if(this.dataList['list']) {
            let index = this.dataList['list'].findIndex(obj => obj.id == id);
            if (index != -1)
                this.dataList['list'].splice(index,1);
        }
    }

    public getIndexById(id:string):number
    {
        if(this.dataList['list'])
            return this.dataList['list'].findIndex(obj => obj.id == id);
        return -1;
    }

    public getIncludeKeys(keys:Array<string>,useRuleSave=false){
        let data={};
        let that = this;
        keys.forEach(key=>{
            if(that.rules && that.rules[key] && !useRuleSave)
                data[key] = that.rules[key];
            if(that.rulesSave && that.rulesSave[key] && useRuleSave)
                data[key] = that.rulesSave[key];
        });
        return data;
    }
    public getExcludeKeys(keys:Array<string>,useRuleSave=false){
        let data={};
        let that = this;
        let keysModel = Object.keys(useRuleSave?this.rulesSave:this.rules)
        keysModel.forEach(key=>{
            if(keys.indexOf(key)<0 && !useRuleSave)
                data[key] = that.rules[key];
            if(keys.indexOf(key)<0 && useRuleSave)
                data[key] = that.rulesSave[key];
        });
        return data;
    }
    public setLoadData(data) {
        this.dataList.list.unshift(data);
        this.dataList.count++;
        if (this.dataList.count > this.rest.max)
            this.dataList.list.pop();
    }
    public setUpdateData(data){
        if(data.id){
            let index = this.getIndexById(data.id);
            if(index >= 0){
                Object.assign(this.dataList.list[index],data);
            }
        }
    }
    public setDeleteData(data){
        if(data.id){
            let index = this.getIndexById(data.id);
            if(index >= 0){
                this.dataList.list.splice(index,1);
            }
        }
    }
    public setBlockField(data,value?:boolean){
        if(data.id){
            let index = this.getIndexById(data.id);
            if(index >= 0){
                this.dataList['list'][index].blockField= value==null?!this.dataList['list'][index].blockField:value;
            }
        }
    }

    public refreshData(data){
        this.setBlockField(data,true);
        setTimeout(function(){
            this.setBlockField(data,false);
        }.bind(this), 1);
    }

    public refreshList(){
        // this.lockList = true;
        // setTimeout(()=>{
        //     this.lockList=false;
        // },100);
        if(this.dataList) {
            if (this.dataList.list) {
                this.dataList.list.forEach(function (data) {
                    this.refreshData(data);
                }.bind(this));
            }
            else
                this.refreshData(this.dataList);
        }

    }

    goPage(url:string,event?) {
        if (event)
            event.preventDefault();
        let link = [url, {}];
        this.db.router.navigate(link);
    }

    public getActionsArray(actionsName:'data'|'model', data:Object) { //data se usa en tiempo de ejecucion segun el string dentro de "eval()"
        let array=[];
        let actions = (actionsName == 'data')?this.dataActions:this.modelActions;
        Object.keys(actions).forEach((key=>{
            if(actions[key].permission) array.push(actions[key]);
        }).bind(this));
        return array;
    }

    public updateModelFilter(event,key){
        if(event)
            event.preventDefault();

        if(this.filters && this.filters[key]){
            let currentFilter = this.filters[key];
            if(currentFilter.view[currentFilter.status]){
                if(currentFilter.view[currentFilter.status].where)
                {
                    let code = currentFilter.view[currentFilter.status].where[0]['code'];
                    this.removedCodeFilter(code);

                }
                currentFilter.status = currentFilter.view[currentFilter.status+1]?(currentFilter.status+1):0;

                if(currentFilter.view[currentFilter.status] && currentFilter.view[currentFilter.status].where){
                    let where:IWhere;
                    if(this.rest.where)
                        where = (<any>this.rest.where).concat(currentFilter.view[currentFilter.status].where);
                    else
                        where =  currentFilter.view[currentFilter.status].where;

                    this.rest.where = where;
                }

            }
            this.loadData();
        }
    }

    private onEvent(eventArgs:IRestEvent){
        switch (eventArgs.type){
            case 'onDelete':
                if(this.onEventDelete)
                    this.onEventDelete(eventArgs.args);
                break;

            case 'onSave':
                if(this.onEventSave)
                    this.onEventSave(eventArgs.args);
                break;
        }
    }

    public afterSave(field,data,id?){
        this.onPatch(field,data,id);
    }

}