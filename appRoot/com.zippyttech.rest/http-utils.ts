import {Http} from '@angular/http';
import {contentHeaders} from './headers';
import {ToastyConfig, ToastyService, ToastData, ToastOptions} from "ng2-toasty";
import {DependenciesBase} from "../com.zippyttech.common/DependenciesBase";
import {IData, typeToast} from "./restController";

export class HttpUtils {



    constructor(public http:Http,public toastyService?:ToastyService,public toastyConfig?:ToastyConfig) {}

    private valideVersion(){
        if(localStorage.getItem('VERSION_CACHE') && localStorage.getItem('VERSION_CACHE_HEADER')!='null')
            if(localStorage.getItem('bearer') && (localStorage.getItem('VERSION_CACHE') != localStorage.getItem('VERSION_CACHE_HEADER')))
            {
                localStorage.setItem('VERSION_CACHE',localStorage.getItem('VERSION_CACHE_HEADER'));
                location.reload(true);
            }
    }
    private setCookie(cookie=null){
        if(cookie && cookie!='null')
        {
            localStorage.setItem('VERSION_CACHE_HEADER',cookie);
        }

    }
    private addToast(title:string,message:string,type:typeToast='info',time:number=10000) {

        if(this.toastyService) {
            var toastOptions:ToastOptions = {
                title: title,
                msg: message,
                showClose: true,
                timeout: time,
                theme: 'bootstrap',
                onAdd: (toast:ToastData) => {
                    console.log('Toast ' + toast.id + ' has been added!');
                },
                onRemove: function(toast:ToastData) {
                    console.log('Toast ' + toast.id + ' has been removed!');
                }
            };

            switch (type){
                case 'info':
                    this.toastyConfig.position='top-right';
                    this.toastyService.info(toastOptions);
                    break;
                case 'success':
                    this.toastyService.success(toastOptions);
                    break;
                case 'wait':
                    this.toastyService.wait(toastOptions);
                    break;
                case 'error':
                    this.toastyConfig.position='bottom-center';
                    this.toastyService.error(toastOptions);
                    break;
                case 'warning':
                    this.toastyService.warning(toastOptions);
                    break;
            }
        }
    }
    private createEndpoint(endpoint:string,isAbosulte:boolean=false){
        return (isAbosulte?'':localStorage.getItem('urlAPI')) + endpoint;
    }

    private responseAPI(response,successCallback?){
        this.setCookie(response.headers.get('Cookie'));
        this.valideVersion();
        if (successCallback != null)
        {
            let json = response.json();
            try {
                successCallback(json);
            }catch (exception){
                successCallback(response)
            }
        }

    }
    private errorAPI(error,errorCallback){
        this.setCookie(error.headers.get('Cookie'));
        this.valideVersion();
        if (errorCallback != null)
            errorCallback(error);
    }



    public doGet(endpoint:string, successCallback, errorCallback ,isEndpointAbsolute = false) {
        let that = this;
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.get(endpoint, {headers: contentHeaders})
                .subscribe(
                    response => {
                        that.responseAPI(response,successCallback);
                        resolve(response);
                    },
                    error => {
                        that.errorAPI(error,errorCallback);
                        reject(error);
                    }
                )
        });
    }

    public doDelete(endpoint:string, successCallback, errorCallback,isEndpointAbsolute = false) {
        let that = this;
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.delete(endpoint, {headers: contentHeaders})
                .subscribe(
                    response => {
                        that.responseAPI(response,successCallback);
                        resolve(response);
                    },
                    error => {
                        that.errorAPI(error,errorCallback);
                        reject(error);
                    }
                )
        });
    }

    public doPost(endpoint:string,body, successCallback, errorCallback,isEndpointAbsolute = false) {
        let that = this;
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.post(endpoint,body, {headers: contentHeaders})
                .subscribe(
                    response => {
                        that.responseAPI(response,successCallback);
                        resolve(response);
                    },
                    error => {
                        that.errorAPI(error,errorCallback);
                        reject(error);
                    }
                )
        });
    }

    public doPut(endpoint:string,body, successCallback, errorCallback,isEndpointAbsolute = false) {
        let that = this;
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.put(endpoint,body, {headers: contentHeaders})
                .subscribe(
                    response => {
                        that.responseAPI(response,successCallback);
                        resolve(response);
                    },
                    error => {
                        that.errorAPI(error,errorCallback);
                        reject(error);
                    }
                )
        });
    }



    public onSave(endpoint:string, body:string,list:Array<Object>, errorCallback = null,isEndpointAbsolute = false) {

        let successCallback = (response => {
            if(list != null)
                list.unshift(response);
            if (this.toastyService)
                this.addToast('Notificacion','Guardado con éxito');
        }).bind(this);
        return this.doPost(endpoint,body,successCallback,errorCallback,isEndpointAbsolute)
    }

    public onLoadList(endpoint:string, list:IData, errorCallback = null,isEndpointAbsolute = false) {
        let successCallback= response => {
            Object.assign(list, response);
        };
        return this.doGet(endpoint,successCallback,errorCallback,isEndpointAbsolute);
    }

    public onDelete(endpoint:string,id:number, list:Array<Object> ,errorCallback = null,isEndpointAbsolute = false) {
        let successCallback = (response => {
            if(list != null){
                let index = list.findIndex(obj => obj['id'] == id);
                if(index!=-1)
                    list.splice(index,1);
            }
            if (this.toastyService)
                this.addToast('Notificacion','Borrado con éxito');
        }).bind(this);
        return this.doDelete(endpoint,successCallback,errorCallback,isEndpointAbsolute);
    }

    public onUpdate(endpoint:string,body:string,data:Object, errorCallback = null,isEndpointAbsolute = false){
        let successCallback = (response => {
            Object.assign(data, response);
            if (this.toastyService)
                this.addToast('Notificacion','Actualizado con éxito');
        }).bind(this);
        return this.doPut(endpoint,body,successCallback,errorCallback,isEndpointAbsolute)
    }


}