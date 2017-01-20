import {Injectable} from '@angular/core';
import {RestController} from "../com.zippyttech.rest/restController";
import {contentHeaders} from "../com.zippyttech.rest/headers";
import {FormControl, Validators} from "@angular/forms";
import {Http} from "@angular/http";
import {ToastyService, ToastyConfig} from "ng2-toasty";

@Injectable()
export class globalService extends RestController{
    user:any={};
    params:any={};
    help:any={};
    permissions:any=[];

    public publicData:any={};

    public visualData:any = {};

    public qrPublic:any;

    public channelWebsocket:any={};

    public navigationStart:boolean=false;

    public dataSesion = new FormControl(
        null,
        Validators.compose([
            (c:FormControl)=> {
                if(c.value){
                    if( c.value.token.status &&
                        c.value.user.status  &&
                        c.value.permissions.status &&
                        c.value.params.status &&
                        c.value.help.status
                    )
                    {return null;}
                }
                return {object: {valid: false}};
            }
        ])
    );
    public saveUrl:string;

    objectInstance:any={};//lista de instancias creadas
    
    constructor(public http:Http, public toastyService:ToastyService, public toastyConfig:ToastyConfig) {
        super({'http':http,'toastyService':toastyService,'toastyConfig':toastyConfig});
        this.existLocalStorage();

    }

    existLocalStorage(){
        if (typeof(Storage) !== "undefined") {
            console.log("habemus localstorage")
        } else {
            console.log("no habemus localstorage")
        }
        this.loadVisualData();
    }
    initSession():void{
        this.dataSesionInit();
        this.loadValidToken();
        this.loadMyPermissions();
        this.loadParams();
        this.loadTooltips();
    }
    dataSesionInit():void{
        this.dataSesion.setValue({
            'token':        {'status':false,'title':'Validando usuario'},
            'user':         {'status':false,'title':'Consultando datos del usuario'},
            'permissions':  {'status':false,'title':'Consultando  permisos'},
            'params':       {'status':false,'title':'Consultando  parametros'},
            'help':         {'status':false,'title':'Consultando  ayudas'},
        });
    }
    errorGS = (err:any):void => {
        if(localStorage.getItem('bearer')){
            if(this.db.toastyService)
                this.addToast('Ocurrio un error',err,'error',10000);

            this.dataSesionInit();
            localStorage.removeItem('bearer');
            contentHeaders.delete('Authorization');
            window.location.href = "#/auth/login";
        }
    }
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
            Object.assign(that.user,that.user,response.json().list[0]);
            that.dataSesion.value.user.status=true;
            that.dataSesion.setValue(that.dataSesion.value);

        };
        let where = encodeURI('[["op":"eq","field":"username","value":"'+this.user.username+'"],["join":"account",where:[["op":"eq","field":"name","value":"'+this.user.account+'"]]]]');
        this.httputils.doGet('/users?where='+where, successCallback,this.errorGS);
    };
    loadMyPermissions():any{
        let that = this;
        let successCallback= (response:any) => {
            Object.assign(that.permissions,response.json());
            that.dataSesion.value.permissions.status=true;
            that.dataSesion.setValue(that.dataSesion.value);
        };
        return this.httputils.doGet('/current/permissions/',successCallback,this.errorGS);
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

    loadVisualData():void{
        let data:any =
        {

        };
        this.visualData = Object.assign(data);
    }

    existsPermission(keys:any):boolean{
        let index = this.permissions.findIndex((obj:any) => (keys.indexOf(obj.id) >= 0 || keys.indexOf(obj.code)>=0));
        if(index > -1)
            return true;
        return false;
    }


    getParams(code:string):string{
        let that = this;
        let valor="";
        Object.keys(this.params || {}).forEach(index=>{
            if(that.params[index].code==code){
                valor=that.params[index].value;
                return;
            }
        });
        return valor;
    }

    getTooltip(code:string):any{
        let that = this;
        let valor={};
        Object.keys(this.help || {}).forEach(index=>{
            if(that.help[index].code==code){
                valor=that.help[index];
                return;
            }
        });
        return valor;
    }
    getKeys(data:any):any{
        return Object.keys(data || {});
    }
    
}