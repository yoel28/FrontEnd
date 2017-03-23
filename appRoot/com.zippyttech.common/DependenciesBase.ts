import {Router, ActivatedRoute} from "@angular/router";
import {Http} from "@angular/http";
import {globalService} from "../com.zippyttech.utils/globalService";
import {ToastyService, ToastyConfig} from "ng2-toasty";
import {Injectable} from "@angular/core";
import {StaticValues} from "../com.zippyttech.utils/catalog/staticValues";
import {StaticFunction} from "../com.zippyttech.utils/catalog/staticFunction";
import {WebSocket} from "../com.zippyttech.utils/websocket";


@Injectable()
export class DependenciesBase {
    public msg = StaticValues.msg;
    public msgParams = StaticValues.msgParams;
    public classCol=StaticFunction.classCol;
    public classOffset=StaticFunction.classOffset;
    public pathElements=StaticValues.pathElements;

    constructor(
                public router: Router,
                public http:Http,
                public myglobal:globalService,
                public toastyService:ToastyService,
                public toastyConfig:ToastyConfig,
                public ws:WebSocket
    ){}

    public debugLog =  this.myglobal.debugLog.bind(this.myglobal);

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

}