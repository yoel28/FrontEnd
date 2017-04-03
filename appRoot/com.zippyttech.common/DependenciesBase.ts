import {Router, NavigationExtras} from "@angular/router";
import {Http} from "@angular/http";
import {globalService} from "../com.zippyttech.utils/globalService";
import {ToastyService, ToastyConfig} from "ng2-toasty";
import {Injectable} from "@angular/core";
import {StaticValues} from "../com.zippyttech.utils/catalog/staticValues";
import {StaticFunction} from "../com.zippyttech.utils/catalog/staticFunction";
import {WebSocket} from "../com.zippyttech.utils/websocket";
import {ModalService} from "../com.zippyttech.services/modal/modal.service";
import {ModelService} from "../com.zippyttech.services/model/model.service";
import {API} from "../com.zippyttech.utils/catalog/defaultAPI";

export interface IElementsApp{
    app?:HTMLElement;
}

@Injectable()
export class DependenciesBase {
    public msg = StaticValues.msg;
    public msgParams = StaticValues.msgParams;
    public classCol=StaticFunction.classCol;
    public classOffset=StaticFunction.classOffset;
    public pathElements=StaticValues.pathElements;
    public $elements:IElementsApp = {};

    public modelService:ModelService;

    public myglobal:globalService;
    public ws:WebSocket;

    constructor(
                public router: Router,
                public http:Http,
                public toastyService:ToastyService,
                public toastyConfig:ToastyConfig,
                public ms:ModalService
    ){
        this.ngOnInit();
    }

    ngOnInit(){
        this.myglobal = new globalService(this);
        this.ws = new WebSocket(this);
        this.modelService = new ModelService(this);
    }

    public templateTypeOf(value){
        return typeof (value);
    }

    public evalMe(data:any,exp){
        try{
            return eval(exp);
        }catch (exception){
            this.debugLog(['Error evalMe',data,exp,exception])
        }
    }

    public debugLog(logs:string|Array<any>){
        let modeDebug = this.getParams('MODE_DEBUG',API.MODE_DEBUG);
        if(modeDebug)
        {
            console.log('BEGIN-------------------------------------------------------------------------------------------');
            if(typeof logs === 'string')
                console.log(logs);
            if(typeof logs === 'object' && logs.length){
                logs.forEach(log=>{
                    console.log(log)
                })
            }
            console.log('END-------------------------------------------------------------------------------------------');
        }
    }

    public getParams(code:string,defaultValue?:any):any{
        return this.myglobal.getParams(code,defaultValue)
    }

    //TODO: BUSCAR en CLUB y IPANAMA
    public goPage(url:string,event=null,params:NavigationExtras={}) {
        if (event)
            event.preventDefault();
        this.router.navigate([url,params]);
    }
}