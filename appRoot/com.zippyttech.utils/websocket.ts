import {Injectable} from '@angular/core';
import {FormControl} from "@angular/forms";


declare var SockJS:any;
declare var Stomp:any;

@Injectable()
export class WebSocket {
    /**
     * this.ws.client.ws.readyState
     * 0= Nada
     * 1= Conectado
     * 3= Desconectado
     * */


    public webSocket={};

    constructor(){}

    setWebSocket(channel){
        if(!this.webSocket[channel]){
            this.webSocket[channel]={
                'client':null,
                'data': new FormControl(),
                'status':new FormControl('close'),
                'reconnect':0,
                'forceClose':false,
                'subscribers':{
                    'client':null,
                }
            }
        }
        else{
            this.webSocket[channel].reconnect=0;
            this.webSocket[channel].forceClose=false;
        }
    }

    onSocket(channel) {
        this.setWebSocket(channel);
        this.onConnect(channel);
    }
    onMessage(channel,value){
        this.webSocket[channel].client.send("/app/message", {priority: 9}, value);
    }
    onConnect(channel){
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
                            });
                        }
                    },
                    function(error) {
                        that.webSocket[channel].status.setValue('error');
                        that.webSocket[channel].reconnect++;
                        if(that.webSocket[channel].reconnect<=5){
                            setTimeout(function() {that.onConnect(channel)}, 1000);
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
}