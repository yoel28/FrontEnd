import {Injectable} from '@angular/core';
import {FormControl} from "@angular/forms";
import {globalService} from "./globalService";
import {ModelRoot} from "../com.zippyttech.common/modelRoot";


declare var SockJS:any;
declare var Stomp:any;

export interface IWebSocket{
    [channel:string]:{
        data:FormControl;//objecto donde se escribe todo lo que llega del ws
        status:FormControl; //status del ws
        instance?:ModelRoot;
        reconnect:number; //numero de reconexiones
        client?:any; //Client Stomp
        forceClose?:boolean; //cerrar ws forzado
        subscribers:{
            client:any;//subcriber de client stomp
        }
    }
}

@Injectable()
export class WebSocket{
    /**
     * this.ws.client.ws.readyState
     * 0= Nada
     * 1= Conectado
     * 3= Desconectado
     * */


    public webSocket:IWebSocket={};
    public channelsByModel={};

    constructor(public myglobal:globalService){}

    setWebSocket(channel,instance?:ModelRoot){
        if(!this.webSocket[channel]){
            this.webSocket[channel]={
                'data': new FormControl(),
                'instance':instance,
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
            this.webSocket[channel].instance=instance;
        }
    }

    onSocket(channel) {
        this.setWebSocket(channel);
        this.onConnect(channel);
    }

    onMessage(channel,value){
        this.webSocket[channel].client.send("/app/message", {priority: 9}, value);
    }

    onConnect(channel,eventChannel?:Object){
        try {
            if(this.checkContinue(channel)){

                let that = this;
                let ws = new SockJS(localStorage.getItem('url') + "/stomp");

                that.webSocket[channel].status.setValue('init');
                that.webSocket[channel].client = Stomp.over(ws);

                that.webSocket[channel].client.connect({},
                    function () {
                        that.webSocket[channel].status.setValue('connect');
                        if(that.checkContinue(channel)){
                            that.webSocket[channel].subscribers.client = that.webSocket[channel].client.subscribe(channel, function (message) {
                                that.webSocket[channel].data.setValue(JSON.parse(message.body));
                                if(eventChannel){
                                    that.eventChannel(eventChannel);
                                }
                            });
                        }
                    },
                    function(error) {
                        that.webSocket[channel].status.setValue('error');
                        that.webSocket[channel].reconnect++;
                        if(that.webSocket[channel].reconnect<=5){
                            setTimeout(function() {that.onConnect(channel)}, 500);
                        }
                    }
                );
            }
        }catch (e){
            console.log('revento')
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
            this.myglobal.channels.forEach(obj=>{
                if(obj.model ==  model)
                    channels.push(obj)
            });
            this.channelsByModel[model]=channels;
        }
    }

    loadChannelByModel(model:string,instance:ModelRoot){
        let that = this;
        this.findChannelByModel(model);
        this.channelsByModel[model].forEach(obj=>{
            that.setWebSocket(obj.target,instance);
            that.onConnect(obj.target,obj);
        });
    }
    eventChannel(eventChannel:any){
        if(this.webSocket[eventChannel.target].instance){
            switch (eventChannel['eventType']) {
                case "INSERT" :
                    this.webSocket[eventChannel.target].instance.setLoadData(this.webSocket[eventChannel.target].data.value);
                    break;
                case "UPDATE" :
                    this.webSocket[eventChannel.target].instance.setUpdateData(this.webSocket[eventChannel.target].data.value);
                    break;
                case "DELETE" :
                    this.webSocket[eventChannel.target].instance.setDeleteData(this.webSocket[eventChannel.target].data.value);
                    break;
                default:{

                }
            }
        }
        else {
            console.log('Error: not found intance for channel '+eventChannel.target);
        }

    }


}