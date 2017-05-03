import {RestController} from "../com.zippyttech.rest/restController";
import {contentHeaders} from "../com.zippyttech.rest/headers";
import {FormControl, Validators} from "@angular/forms";
import {IRule} from "../com.zippyttech.common/rules/rule";
import {DependenciesBase} from "../com.zippyttech.common/DependenciesBase";

/**
 * @Params API
 * Optional
 *      MODE_DEBUG
 *
 *
 */

var moment = require("moment");

export class globalService extends RestController{
    user:any={};
    params:any=[];
    help:any=[];
    permissions:any=[];
    rules:any=[];

    public publicData:any={};

    public visualData:any = {};

    public qrPublic:any;


    public navigationStart:boolean=false;
    public menuItems:FormControl = new FormControl([]);

    public dataSesion = new FormControl(
        null,
        Validators.compose([
            (c:FormControl)=> {
                if(c.value){
                    if( c.value.token.status &&
                        c.value.user.status  &&
                        c.value.permissions.status &&
                        c.value.params.status &&
                        c.value.help.status &&
                        c.value.rules.status &&
                        c.value.channels.status
                    )
                    {return null;}
                }
                return {object: {valid: false}};
            }
        ])
    );
    public saveUrl:string;

    objectInstance:any={};//lista de instancias creadas
    
    constructor(public db:DependenciesBase) {
        super(db);
    }

    initSession():void{
        this.dataSesionInit();
        this.loadValidToken();
        this.loadMyPermissions();
        this.loadParams();
        this.loadTooltips();
        this.loadRules();
        this.loadChannels();
    }
    dataSesionInit(value = false):void{
        this.user={};
        this.params=[];
        this.help=[];
        this.permissions=[];
        this.rules=[];
        this.db.ws.channelsAll=[];

        this.menuItems.setValue([]);
        this.dataSesion.setValue({
            'token':        {'status':value,'title':'Validando usuario'},
            'user':         {'status':value,'title':'Consultando datos del usuario'},
            'permissions':  {'status':value,'title':'Consultando  permisos'},
            'params':       {'status':value,'title':'Consultando  parametros'},
            'help':         {'status':value,'title':'Consultando  ayudas'},
            'rules':        {'status':value,'title':'Consultando  reglas'},
            'channels':     {'status':value,'title':'Consultando  canales'},
        });
    }
    errorGS = (err:any):void => {
        if(localStorage.getItem('bearer')){
            if(this.db.toastyService)
                this.httputils.addToast('Ocurrio un error',err,'error',10000);

            this.dataSesionInit();
            localStorage.removeItem('bearer');
            contentHeaders.delete('Authorization');
            window.location.href = "#/auth/login";
        }
    };

    loadValidToken():void{
        let that=this;
        let successCallback=(response:any) => {
            Object.assign(that.user, response.json());
            that.dataSesion.value.token.status=true;
            that.dataSesion.setValue(that.dataSesion.value);
            let data = that.user.username.split('/');
            that.user.username=data[1];
            that.user.account=data[0];
            that.loadUser();
        };
        this.httputils.doGet('/validate',successCallback,this.errorGS);
    }
    loadUser():void{
        let that = this;
        let successCallback= (response:any) => {
            Object.assign(that.user,that.user,response.json());
            that.dataSesion.value.user.status=true;
            that.dataSesion.setValue(that.dataSesion.value);

        };
        this.httputils.doGet('/current/user/', successCallback,this.errorGS);
    };
    loadMyPermissions():any{
        let that = this;
        let successCallback= (response:any) => {
            Object.assign(that.permissions,response.json());
            that.dataSesion.value.permissions.status=true;
            that.dataSesion.setValue(that.dataSesion.value);
        };
        return this.httputils.doGet('/current/permissions/?max=1000',successCallback,this.errorGS);
    }
    loadParams():void{
        let that = this;
        let successCallback= (response:any) => {
            Object.assign(that.params,response.json().list);
            that.dataSesion.value.params.status=true;
            that.dataSesion.setValue(that.dataSesion.value);
        };
        this.httputils.doGet('/params?max=1000',successCallback,this.errorGS);
    }
    loadTooltips():void{
        let that = this;
        let successCallback= (response:any) => {
            Object.assign(that.help,response.json().list);
            that.dataSesion.value.help.status=true;
            that.dataSesion.setValue(that.dataSesion.value);
        };
        this.httputils.doGet('/infos?max=1000',successCallback,this.errorGS);
    }
    loadRules():void{
        let that = this;
        let successCallback= (response:any) => {
            Object.assign(that.rules,response.json().list);
            that.dataSesion.value.rules.status=true;
            that.dataSesion.setValue(that.dataSesion.value);
        };
        this.httputils.doGet('/rules?max=1000',successCallback,this.errorGS);
    }
    loadChannels():void{
        let that = this;
        let successCallback= (response:any) => {
            Object.assign(that.db.ws.channelsAll,response.json().list);
            that.dataSesion.value.channels.status=true;
            that.dataSesion.setValue(that.dataSesion.value);
        };
        this.httputils.doGet('/channels?max=1000',successCallback,this.errorGS);
    }

    existsPermission(keys:any):boolean{
        let index = this.permissions.findIndex((obj:any) => (keys.indexOf(obj.id) >= 0 || keys.indexOf(obj.code)>=0));
        return index > -1;

    }

    getParams(code:string,defaultValue?:any):any{
        let data = this.getByAccountData(this.params,code);
        try {
            switch (data.type){
                case 'number':
                    return parseFloat(data.value);
                case 'boolean':
                    return data.value=='true'?true:false;
                case 'object':
                    return JSON.parse(data.value);
                case 'date':
                    return moment(data.value).format('DD/MM/YYYY');
                case 'datetime':
                    return moment(data.value).format('DD/MM/YYYY  HH:mm');
                default:
                    return data.value || defaultValue;
            }
        } catch (exception){
            this.db.debugLog('Error getParams',exception);
            return defaultValue;
        }
    }

    getRule(code:string):string{
        let data = this.getByAccountData(this.rules,code);
        return data.rule || '';
    }

    getTooltip(code:string):any{
        return this.getByAccountData(this.help,code);
    }

    getByAccountData(list,code){
        let that = this;
        let value:any={};
        list.forEach(obj=>{
            if(obj.accountId == that.user.accountId && obj.code ==  code){
                value=obj;
                return;
            }
            if(!value.id && obj.accountId == null && obj.code ==  code){
                value=obj;
            }
        });
        return value;
    }


    getKeys(data:any):any{
        return Object.keys(data || {});
    }

    getPreferenceViewModel(model:string,rules:Object){
        if(this.user.preferences && this.user.preferences.columns){
            if(this.user.preferences.columns[model.replace('Model','')]){
                if(this.checkKeysView(this.user.preferences.columns[model.replace('Model','')],Object.keys(rules))){
                    return this.user.preferences.columns[model.replace('Model','')];
                }
            }
        }
        this.setPreferenceViewModel(model,rules);
        return this.user.preferences.columns[model.replace('Model','')];
    }
    setPreferenceViewModel(model:string,rules:Object,reset=false){
        let that = this;
        if(!this.user.preferences)
            this.user.preferences={};

        if(!this.user.preferences.columns){
            this.user.preferences.columns={};
        }

        this.user.preferences.columns[model.replace('Model','')]=[];
        Object.keys(rules).forEach(key=>{
            if(reset){
                (<IRule>rules[key]).permissions.visible = reset;
            }
            let display:string;
            that.user.preferences.columns[model.replace('Model','')].push
            (
                {   'key':key,
                    'visible':(<IRule>rules[key]).permissions.visible,
                    'exclude':(<IRule>rules[key]).exclude?true:false,
                    'display':(<IRule>rules[key]).key,//TODO: checkear en instancias ModelRoot
                }
            )
        });
    }
    private checkKeysView(saveKeys,currentKeys):boolean{
        let equalKeys=true;
        saveKeys.forEach(obj=>{
            if(currentKeys.indexOf(obj.key) < 0){
                equalKeys=false;
            }
        });
        if(saveKeys.length !=  currentKeys.length)
            equalKeys= false;
        return equalKeys;
    }


    
}