import {StaticValues} from "../com.zippyttech.utils/catalog/staticValues";
import {RestController} from "../com.zippyttech.rest/restController";
import {DependenciesBase} from "./DependenciesBase";

declare var moment:any;
interface IParamsDelete{
    key:string,
    message:string
}
export interface IModelActions{
    [key:string]:{
        title?: string,
        icon?: string,
        permission?: boolean,
        message?: string,
        exp?: string,
        callback?: (data?:any)=>void;
        keyAction?:string;
    }
}

export abstract class ModelRoot extends RestController{

    public prefix = "DEFAULT";
    public endpoint = "DEFAULT_ENDPOINT";
    public useGlobal:boolean=true;
    public completed=false;
    public permissions:any = {};
    public paramsSearch:any = {};
    public paramsSave:any = {};
    public ruleObject:any={};
    public rulesSave:any={};

    public navIndex:number=-1;
    private modelAction:IModelActions={};

    private paramsDelete:IParamsDelete={
        key:'code',
        message:'¿ Esta seguro de eliminar el valor con el codigo: '
    };

    public configId = moment().valueOf();
    private rulesDefault:any = {};
    public rules:Object={};

    public dataList:any={};


    constructor(public db:DependenciesBase,prefix,endpoint,useGlobal=true){
        super(db);
        this.prefix = prefix;
        this.endpoint = endpoint;
        this.useGlobal = useGlobal;
        this._initModel();
    }

    private _initModel(){
        this._initPermissions();
        this._initRules();
        this._initParamsSearch();
        this._initParamsSave();
        this._initRuleObject();
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
        this.initParamsDelete(this.paramsDelete);
        this.initModelActions(this.modelAction);
        this.db.ws.loadChannelByModel(this.constructor.name,this);
        this.completed=completed;
    }

    abstract initPermissions();
    private _initPermissions() {
        this.permissions['export'] = this.db.myglobal.existsPermission([this.prefix + '_EXPORT']);
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
        this.permissions['audit'] = this.db.myglobal.existsPermission([this.prefix + '_AUDICT']);
        this.permissions['global'] = this.db.myglobal.existsPermission(['ACCESS_GLOBAL']) && this.useGlobal;
    }

    abstract initModelActions(params:IModelActions);
    private _initModelActions(){

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
            'icon': 'fa fa-list',
            "type": "textarea",
            "key": "detail",
            "title": "Detalle",
            "placeholder": "Ingrese el detalle",
        };
        this.rulesDefault["enabled"] = {
            "update": (this.permissions.update && this.permissions.lock),
            "visible": this.permissions.lock && this.permissions.visible,
            "search": false,
            'required': true,
            'icon': 'fa fa-list',
            "type": "boolean",
            'source': [
                {'value':true,'text': 'Habilitado', 'class': 'btn btn-sm btn-green','title':'Habilitado'},
                {'value':false,'text': 'Deshabilitado', 'class': 'btn btn-sm btn-red','title':'Deshabilitado'},
            ],
            "key": "enabled",
            "title": "Habilitado",
            "placeholder": "",
        };
        this.rulesDefault["editable"] = {
            "update": (this.permissions.update && this.permissions.lock),
            "visible": this.permissions.lock && this.permissions.visible,
            "disabled":'!data.enabled',
            "search": this.permissions.search,
            'icon': 'fa fa-list',
            "type": "boolean",
            'source': [
                {'value':true,'text': 'Editable', 'class': 'btn btn-sm btn-green','title':'Editable'},
                {'value':false,'text': 'Bloqueado', 'class': 'btn btn-sm btn-red','title':'Bloqueado'},
            ],
            "key": "editable",
            "title": "Editable",
            "placeholder": "Editable",
        };
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

    abstract initParamsDelete(params:IParamsDelete);
    public get getParamsDelete():IParamsDelete{
        return this.paramsDelete;
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
        })


        delete this.rulesSave['editable'];
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
    public setBlockField(data){
        if(data.id){
            let index = this.getIndexById(data.id);
            if(index >= 0){
                this.dataList['list'][index].blockField=!this.dataList['list'][index].blockField;
            }
        }
    }
    public getDetail(data){
        let backup = this.dataList;
        this.dataList = data;
        this.dataList.count = 1;
        this.dataList.backup = backup;
    // ,{'listBackup':this.dataList}
    //  Object.assign(this.dataList,data);
        //Object.assign({},this.dataList,data);
    }
    public getReturn(){
        Object.assign(this.dataList,this.dataList.listBackup);
    }
}