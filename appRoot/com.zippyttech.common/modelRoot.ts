import {StaticValues} from "../com.zippyttech.utils/catalog/staticValues";
import {RestController} from "../com.zippyttech.rest/restController";
import {DependenciesBase} from "./DependenciesBase";

declare var moment:any;
declare var jQuery:any;

interface IParamsDelete{
    key:string,
    message:string
}
export interface IModelActions{
    [key:string]:{
        id?:string,
        title?: string,
        icon?: string,
        permission?: boolean,
        message?: string,
        exp?: string,
        callback?: (data?:any)=>void;
        key?:string;
    }
}

export abstract class ModelRoot extends RestController{

    public prefix = ((this.constructor.name).toUpperCase()).replace('MODEL','');
    public endpoint = "DEFAULT_ENDPOINT";
    public useGlobal:boolean=true;
    public completed=false;
    public permissions:any = {};
    public paramsSearch:any = {};
    public paramsSave:any = {};
    public ruleObject:any={};
    public rulesSave:any={};

    public navIndex:number=-1;
    private actions:IModelActions={};


    public configId = moment().valueOf();
    private rulesDefault:any = {};
    public rules:Object={};

    public dataList:any={};


    constructor(public db:DependenciesBase,endpoint:string,useGlobal:boolean=true,prefix?:string){
        super(db);
        if(prefix)
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
        this.initModelActions(this.actions);

        this.db.ws.loadChannelByModel(this.constructor.name,this);
        this.completed=completed;
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

    abstract initModelActions(params:IModelActions);
    private _initModelActions(){

        this.actions["delete"] = {
            id:this.prefix+'_'+this.configId+'_DEL',
            icon: "fa fa-trash",
            exp:'data.enabled && data.editable && !data.deleted',
            title: 'Eliminar',
            callback:function(data?){
                jQuery("#"+this.prefix+'_'+this.configId+'_DEL').modal('show');
            }.bind(this),
            permission: this.permissions.delete,
            message:'¿ Esta seguro de eliminar el valor con el codigo: ',
            key: 'code'
        };

        this.actions["view"] = {
            icon: "fa fa-vcard",
            title: 'ver',
            callback:function(data?){
                this.getDetail(data);
            }.bind(this),
            permission: true,
        }

    }
    public get getActions(){
        return this.actions;
    };


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
        this.loadRulesExtra();

    }
    private loadRulesExtra(){
        this.setRuleEnable();
        this.setRuleEditable();
        this.setRuleId();
        this.setRuleIp();
        this.setRuleUserAgent();
        this.setRuleUsernameCreator();
        this.setRuleUsernameUpdater();
    }
    setRuleEnable(force =  false){
        if(this.permissions.lock || force){
            this.rulesDefault["enabled"] = {
                "update": (this.permissions.update && this.permissions.lock),
                "visible": this.permissions.lock && this.permissions.visible,
                "search": false,
                "disabled":"data.deleted",
                'required': true,
                "type": "boolean",
                'source': [
                    {
                        'value': true,
                        'text': 'Habilitado',
                        'class': 'btn-transparent text-green',
                        'title': 'Habilitado',
                        'icon': 'fa fa-unlock'
                    },
                    {
                        'value': false,
                        'text': 'Deshabilitado',
                        'class': 'btn-transparent  text-red',
                        'title': 'Deshabilitado',
                        'icon': 'fa fa-lock'
                    },
                ],
                "key": "enabled",
                "title": "Habilitado",
                "placeholder": "",
            };
        }
    }
    setRuleEditable(force=false){
        if(this.permissions.lock || force){
            this.rulesDefault["editable"] = {
                "update": (this.permissions.update && this.permissions.lock),
                "visible": this.permissions.lock && this.permissions.visible,
                "disabled":'!data.enabled || data.deleted',
                "search": this.permissions.search,
                'icon': 'fa fa-list',
                "type": "boolean",
                'source': [
                    {
                        'value': true,
                        'text': 'Editable',
                        'class': 'btn-transparent text-green',
                        'title': 'Editable',
                        'icon': 'fa fa-pencil-square-o'
                    },
                    {
                        'value': false,
                        'text': 'Bloqueado',
                        'class': 'btn-transparent  text-red',
                        'title': 'Protegido',
                        'icon': 'fa fa-lock'
                    },
                ],
                "key": "editable",
                "title": "Editable",
                "placeholder": "Editable",
            };
        }
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
                "visible": this.permissions.visible,
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
                "visible": this.permissions.visible,
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
                "visible": this.permissions.visible,
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
                "visible": this.permissions.visible,
                "search": this.permissions.filter,
                'icon': 'fa fa-list',
                "type": "text",
                "key": "usernameUpdater",
                "title": "Actualizador",
                "placeholder": "Ingrese el usuario que actualizo",
            };
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