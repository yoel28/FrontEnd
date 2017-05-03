import {FormControl} from "@angular/forms";
import {ModelRoot} from "../com.zippyttech.common/modelRoot";
import {typeToast} from "../com.zippyttech.rest/restController";
import {DependenciesBase} from "../com.zippyttech.common/DependenciesBase";
import {API} from "./catalog/defaultAPI";
/**
 * @Params API
 * Optional
 *      WS_REFRESH,
 *      WS_MAX_RECONNECT,
 *      WS_TIME_RECONNECT,
 *
 *
 */

let SockJS = require('sockjs-client');
let Stomp = require('stompjs');

export interface IWebSocket{
    [channel:string]:{
        data:FormControl;//objecto donde se escribe todo lo que llega del ws
        status:FormControl; //status del ws
        model?:ModelRoot;
        reconnect:number; //numero de reconexiones
        client?:any; //Client Stomp
        forceClose?:boolean; //cerrar ws forzado
        subscribers:{
            client:any;//subcriber de client stomp
        }
    }
}

export class WebSocket{
    /**
     * this.ws.client.ws.readyState
     * 0= Nada
     * 1= Conectado
     * 3= Desconectado
     * */

    public channelsAll=[];

    public webSocket:IWebSocket={};
    public channelsByModel={};


    constructor(public db:DependenciesBase){}

    setWebSocket(channel,model?:ModelRoot){
        if(!this.webSocket[channel]){
            this.webSocket[channel]={
                'data': new FormControl(),
                'model':model,
                'status':new FormControl('close'),
                'reconnect':0,
                'subscribers':{
                    'client':null,
                }
            }
        }
        else{
            this.webSocket[channel].reconnect=0;
            this.webSocket[channel].forceClose=false;
            this.webSocket[channel].model=model;
        }
    }

    onSocket(channel) {
        this.setWebSocket(channel);
        this.onConnect(channel);
    }

    onMessage(channel,value){
        this.webSocket[channel].client.send("/app/message", {priority: 9}, value);
    }

    onConnect(channel:string,eventChannel?:Object){
        try {
            if(this.checkContinue(channel)){

                let ws = new SockJS(localStorage.getItem('url') + "/stomp");

                this.webSocket[channel].status.setValue('init');
                this.webSocket[channel].client = Stomp.Stomp.over(ws);

                this.webSocket[channel].client.connect({},
                   () => {
                        this.webSocket[channel].status.setValue('connect');
                        if(this.checkContinue(channel)){
                            this.webSocket[channel].subscribers.client = this.webSocket[channel].client.subscribe(channel, (message) => {
                                try {
                                    let data  = JSON.parse(message.body);
                                    this.webSocket[channel].data.setValue(data);
                                }
                                catch (exception){
                                    this.webSocket[channel].data.setValue(message.body);
                                    this.db.debugLog('Error-01: onConnect','WebSocket',exception);
                                }
                                if(eventChannel){
                                    this.eventChannel(eventChannel);
                                }
                            });
                        }
                    },
                    function(error) {
                        this.webSocket[channel].status.setValue('error');
                        this.webSocket[channel].reconnect++;
                        if(this.webSocket[channel].reconnect<=this.db.getParams('WS_MAX_RECONNECT',API.WS_MAX_RECONNECT)){
                            setTimeout(() => {this.onConnect(channel)}, this.db.getParams('WS_TIME_RECONNECT',API.WS_TIME_RECONNECT));
                        }
                    }
                );
            }
        }catch (exception){
            this.db.debugLog('Error: onConnect',exception);
        }

    }

    checkContinue(channel){
        if(!this.webSocket[channel].forceClose)
            return true;
        this.closeWebsocket(channel);
        return false;
    }

    closeWebsocket(channel){
        this.webSocket[channel].forceClose=true;

        if(this.webSocket[channel].subscribers.client)
            this.webSocket[channel].subscribers.client.unsubscribe();
        if(this.webSocket[channel].client){
            if(this.webSocket[channel].client.connected)
                this.webSocket[channel].client.disconnect();
            this.webSocket[channel].client=null
        }
        this.webSocket[channel].status.setValue('close');
        this.webSocket[channel].subscribers.client=null;
    }

    findChannelByModel(model:string){
        let channels=[];
        if(!this.channelsByModel[model]){
            this.channelsAll.forEach(obj=>{
                if(obj.model ==  model)
                    channels.push(obj)
            });
            this.channelsByModel[model]=channels;
        }
    }

    loadChannelByModel(target:string,model:ModelRoot){
        this.findChannelByModel(target);
        this.channelsByModel[target].forEach(obj=>{
            this.replaceMetaChannel(obj);
            this.setWebSocket(obj.target,model);
            this.onConnect(obj.target,obj);
        });
    }

    private replaceMetaChannel(channel:any){
        try {
            if(channel.target && typeof channel.target === 'string'){
                let currentUser =  this.db.myglobal.user;
                let meta = "$account.name";
                if(channel.target.includes(meta)){
                    channel.target = channel.target.replace(meta,currentUser.accountName);
                }
                return;
            }
            this.db.debugLog('Warning: replaceMetaChannel',channel);
        }catch (exception){
            this.db.debugLog('Error: replaceMetaChannel',channel,exception);
        }

    }

    eventChannel(eventChannel:any){

        let body = this.webSocket[eventChannel.target].data.value;
        let target = eventChannel.target;

        if(this.model(target)){

            switch (eventChannel.event) {
                case "INSERT" :

                    this.model(target).setLoadData(body);

                    this.model(target).setBlockField(body);
                    setTimeout(()=>{
                        this.model(target).setBlockField(body);
                    }, this.db.getParams('REFRESH_WS',API.WS_REFRESH));
                    break;

                case "UPDATE" :

                    this.model(target).setUpdateData(body);

                    this.model(target).setBlockField(body);
                    setTimeout(()=>{
                        this.model(target).setBlockField(body);
                    }, this.db.getParams('REFRESH_WS',API.WS_REFRESH));
                    break;

                case "DELETE" :

                    this.model(target).setBlockField(body);
                    setTimeout(()=>{
                        this.model(target).setDeleteData(body);
                    }, this.db.getParams('REFRESH_WS',API.WS_REFRESH));
                    break;

                default:{

                }
            }
            if(eventChannel['callback']){
                try {
                    this.db.evalMe(this,eventChannel['callback']);
                }catch (exception){
                    this.db.debugLog('Error: eventChannel',exception);
                }
            }
            return;

        }
        this.db.debugLog('Error: eventChannel','Error: not found intance for channel '+eventChannel.target);

    }
    addToast(title:string,message:string,type:typeToast='info',time:number=10000){
        this.db.myglobal.httputils.addToast(title,message,type,time);
    }

    private  model(model:string):ModelRoot{
        if(this.webSocket[model] && this.webSocket[model].model){
            return this.webSocket[model].model;
        }
        return;
    }


}