import {StaticValues} from "../com.zippyttech.utils/catalog/staticValues";
import {RestController} from "../com.zippyttech.rest/restController";
import {DependenciesBase} from "./DependenciesBase";

declare var moment:any;
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

    // public setDataField(id,key,value?,callback?,data?){
    //     let json = {};
    //     json[key] = value || null;
    //     let body = JSON.stringify(json);
    //     return (this.db.myglobal.httputils.onUpdate(this.endpoint + id, body,{}).then(response=>{
    //         if(callback)
    //             callback(response,data);
    //     }));
    // }
    // public loadDataModel(successCallback){
    //     return this.db.myglobal.httputils.doGet(this.endpoint,successCallback,this.myglobal.error);
    // }

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
}