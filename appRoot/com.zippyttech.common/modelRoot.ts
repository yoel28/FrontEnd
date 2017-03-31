import {StaticValues} from "../com.zippyttech.utils/catalog/staticValues";
import {RestController, IWhere, IRestEvent} from "../com.zippyttech.rest/restController";
import {DependenciesBase} from "./DependenciesBase";
import {Actions} from "../com.zippyttech.init/app/app.types";
import {OnInit} from "@angular/core";
import {TextareaRule} from "./rules/textarea.rule";
import {NumberRule} from "./rules/number.rule";
import {TextRule} from "./rules/text.rule";
import {CombodateRule} from "./rules/combodate.rule";

var moment = require('moment');

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
export interface IView{
    title:string;
    display:string;
    key:string;
    code:string;
    icon?:string;
    eval?:string;
    visible?:boolean;
    mode?:'reference'|'checklist';
    exclude?:boolean;
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

    public view:IView;

    public lockList:boolean = false;
    private _currentData:any;
    public get currentData(){return this._currentData;};
    public set currentData(value){this._currentData = value;};

    public onEventDelete:(args:Object)=>void;
    public onEventSave:(args:Object)=>void;
    public configId = moment().valueOf();
    private rulesDefault:any = {};
    public rules:Object={};
    private _navIndex:number=null;
    private transactional:boolean;
    private pendings:number;


    constructor(public db:DependenciesBase,endpoint:string,useGlobal:boolean=true,prefix?:string){
        super(db);
        if(prefix)
            this.prefix = prefix;
        this.endpoint = endpoint;
        this.useGlobal = useGlobal;
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
        this._initView();
        this._initPermissions();
        this._initRules();
        this._initParamsSearch();
        this._initParamsSave();
        this._initDataActions();
        this._initModelActions();
    }
    public initModel(completed=true){
        this.initView(this.view);
        this.initPermissions();
        this.modelExternal();
        this.initRules();
        this.initParamsSearch();
        this.initParamsSave();

        this.loadParamsSave();
        this.loadParamsSearch();

        this.db.ws.loadChannelByModel(this.constructor.name,this);

        this.completed=completed;

        this.initDataActions();
        this.initModelActions();
    }

    abstract initView(params:IView);
    private _initView(){
        this.view ={
            title:'Title default',
            code:this.nameClass+'Id',
            display:this.nameClass+"Code",
            key:this.nameClass,
            visible:true,
        }
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
        this.dataActions = new Actions<IDataActionParams>();
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
            disabled:'data.deleted',
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
            disabled:'!data.enabled || data.deleted',
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
            disabled:'!data.enabled || data.deleted',
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
            disabled:'!data.enabled || !data.editable || data.deleted',
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
        this.modelActions = new Actions<IModelActionParams>();
        this.modelActions.add( "add",{
            permission: this.permissions.add,
            views:[{ title: 'agregar', icon: "fa fa-plus", colorClass:'text-green'}],
            callback:((data?,index?)=>{ this.db.ms.show('save',{ model: this }); }).bind(this),
            stateEval:'0',
            params:{}
        });

        this.modelActions.add("filter",{
            permission: this.permissions.filter,
            views: [ {icon: "fa fa-filter", title: "sin filtro", colorClass:"text-blue"},
                    {icon: "fa fa-filter", title: "filtrando" , colorClass:"text-green"}],
            callback:((data?,index?)=>{ this.db.ms.show('filter',{model: this}); }).bind(this),
            stateEval:'0',
            params:{}
        });

        this.modelActions.add("showDelete", {
            permission: this.permissions.showDelete,
            views: [ {icon: "fa fa-trash", title: "Eliminados ocultos", colorClass:""},
                    {icon: "fa fa-trash", title: "Solo eliminados"   , colorClass:"text-red"},
                    {icon: "fa fa-trash", title: "Todo"   , colorClass:"text-yellow"}, ],
            callback: function (data?, index?){ this.changeDeleted();}.bind(this),
            stateEval:"(data.rest.deleted=='all')?2:(data.rest.deleted=='only')?1:0",
            params: {}
        });

        this.modelActions.add("refresh", {
            permission: this.permissions.update && this.permissions.visible,
            views: [ {icon: "fa fa-refresh", title: "Actualizar", colorClass:"text-blue"},
                    {icon: "fa fa-refresh fa-spin", title: "Actualizando", colorClass:"text-yellow"} ],
            callback: function (data?, index?) { this.loadData(); }.bind(this),
            stateEval:'data.rest.findData?1:0',
            params: {}

        });

        this.modelActions.add("exportPdf",{
            permission: this.permissions.exportPdf,
            views:[ { icon: "fa fa-file-pdf-o", colorClass:"",
                      title:this.db.msg.exportDisabled+this.db.myglobal.getParams('REPORT_LIMIT_ROWS_PDF')+' '+this.db.msg.rows},
                    { icon: "fa fa-file-pdf-o", title:this.db.msg.exportPdf, colorClass:"text-red" }],
            callback:((data?,index?)=>{
                if(this.getEnabledReport('PDF')){
                    let url = localStorage.getItem('urlAPI') + this.endpoint +
                        this.getRestParams() + '&access_token=' +
                        localStorage.getItem('bearer') + '&formatType=pdf' +
                        '&tz=' + moment().format('Z').replace(':', '');
                    window.open(url, '_blank');
                }
            }).bind(this),
            stateEval:"data.getEnabledReport('PDF')?1:0",
            params: {}
        });

        this.modelActions.add("exporXls",{
            permission: this.permissions.exporXls,
            views:[ { icon: "fa fa-file-excel-o", colorClass:"",
                      title:this.db.msg.exportDisabled+this.db.myglobal.getParams('REPORT_LIMIT_ROWS_XLS')+' '+this.db.msg.rows},
                    { icon: "fa fa-file-excel-o", title:this.db.msg.exportXls, colorClass:"text-green" }],
            callback:((data?,index?)=>{
                if(this.getEnabledReport('XLS')){
                    let url = localStorage.getItem('urlAPI')+ this.endpoint +
                    this.getRestParams()+ '&access_token='+
                    localStorage.getItem('bearer')+'&formatType=xls'+
                    '&tz='+moment().format('Z').replace(':','');
                    window.open(url,'_blank');
                }
            }).bind(this),
            stateEval:"data.getEnabledReport('XLS')?1:0",
            params: {}
        });
    }


    abstract modelExternal();
    abstract initRules();

    private _initRules() {
        this.setRuleDetail();
        this.setRuleId();
        this.setRuleIp();
        this.setRuleUserAgent();
        this.setRuleUsernameCreator();
        this.setRuleUsernameUpdater();
        this.setRuleDateCreated();
        this.setRuleDateUpdated();
    }

    setRuleDetail(save=false,required=false){
        this.rulesDefault["detail"] = new TextareaRule({
            required:required,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            include:{
                save:save,
                filter:true,
                list:true
            },
            key: "detail",
            title: "Detalle",
            placeholder: "Ingrese el detalle",
        });
    }

    setRuleId(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["id"] = new NumberRule({
                permissions:{
                    search: this.permissions.filter,
                },
                include:{
                    save:false,
                    filter:true,
                    list:true
                },
                key: "id",
                title: "ID",
                placeholder: "Ingrese el ID",
            });
        }
    }
    setRuleIp(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["ip"] = new TextRule({
                permissions:{
                    search: this.permissions.filter,
                },
                include:{
                    save:false,
                    filter:true,
                    list:true
                },
                "key": "ip",
                "title": "IP",
                "placeholder": "Ingrese la IP",
            });
        }
    }
    setRuleUserAgent(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["userAgent"] = new TextRule({
                permissions:{
                    search: this.permissions.filter,
                },
                include:{
                    save:false,
                    filter:true,
                    list:true
                },
                key: "userAgent",
                title: "userAgent",
                placeholder: "Ingrese el userAgent",
            });
        }
    }
    setRuleUsernameCreator(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["usernameCreator"] = new TextRule({
                permissions:{
                    search: this.permissions.filter,
                },
                include:{
                    save:false,
                    filter:true,
                    list:true
                },
                key: "usernameCreator",
                title: "Creador",
                placeholder: "Ingrese el usuario creador",
            });
        }
    }
    setRuleUsernameUpdater(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["usernameUpdater"] = new TextRule ({
                permissions:{
                    search: this.permissions.filter,
                },
                include:{
                    save:false,
                    filter:true,
                    list:true
                },
                key: "usernameUpdater",
                title: "Actualizador",
                placeholder: "Ingrese el usuario que actualizo",
            });
        }
    }
    setRuleDateCreated(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["dateCreated"] = new CombodateRule({
                permissions:{
                    search: this.permissions.filter,
                },
                include:{
                    save:false,
                    filter:true,
                    list:true
                },
                date:"datetime",
                key: "dateCreated",
                title: "Fecha de creación",
                placeholder: "Ingrese la fecha de creación",
            });
        }
    }
    setRuleDateUpdated(force=false){
        if(this.permissions.audit || force){
            this.rulesDefault["dateUpdated"] = new CombodateRule({
                permissions:{
                    search: this.permissions.filter,
                },
                include:{
                    save:false,
                    filter:true,
                    list:true
                },
                date:"datetime",
                key: "dateUpdated",
                title: "Fecha de actualización",
                placeholder: "Ingrese la fecha de actualización",
            });
        }
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

    getRulesDefault(){
        return this.rulesDefault;
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

    public get nameClass(){
        return (this.constructor.name).replace('MODEL','').toLowerCase();
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

    public getEnabledReport(type:'PDF'|'XLS'='PDF'){
        return (parseFloat(this.db.myglobal.getParams('REPORT_LIMIT_ROWS_'+type)) >= this.dataList.count);
    }

}