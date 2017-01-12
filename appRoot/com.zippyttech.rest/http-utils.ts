import {Http} from '@angular/http';
import {contentHeaders} from './headers';
import {ToastyConfig, ToastyService, ToastData, ToastOptions} from "ng2-toasty";

export class HttpUtils {

    constructor(public http:Http,public toastyService?:ToastyService,public toastyConfig?:ToastyConfig) {
    }

    addToast(title,message,type='info',time=10000) {

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

    createEndpoint(endpoint:string,isAbosulte=false){
        return (isAbosulte?'':localStorage.getItem('urlAPI')) + endpoint;
    }

    doGet(endpoint:string, successCallback, errorCallback ,isEndpointAbsolute = false) {
        let that = this;
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.get(endpoint, {headers: contentHeaders})
                .subscribe(
                    response => {
                        localStorage.setItem('VERSION_CACHE_HEADER',response.headers.get('Cookie'));
                        that.valideVersion();
                        if (successCallback != null)
                            successCallback(response);
                        resolve(response.json());
                    },
                    error => {
                        if (errorCallback != null)
                            errorCallback(error);
                        reject(error);
                    }
                )
        });
    }

    doDelete(endpoint:string, successCallback, errorCallback,isEndpointAbsolute = false) {
        let that = this;
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.delete(endpoint, {headers: contentHeaders})
                .subscribe(
                    response => {
                        localStorage.setItem('VERSION_CACHE_HEADER',response.headers.get('Cookie'));
                        that.valideVersion();
                        if (successCallback != null)
                            successCallback(response);
                        resolve(response);
                    },
                    error => {
                        if (errorCallback != null)
                            errorCallback(error);
                        reject(error);
                    }
                )
        });
    }

    doPost(endpoint:string,body, successCallback, errorCallback,isEndpointAbsolute = false) {
        let that = this;
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.post(endpoint,body, {headers: contentHeaders})
                .subscribe(
                    response => {
                        try
                        {
                            localStorage.setItem('VERSION_CACHE_HEADER',response.headers.get('Cookie'));
                            that.valideVersion();
                            if (successCallback != null)
                                successCallback(response);
                            resolve(response.json());
                        }
                        catch(e)
                        {
                            resolve({});
                        }
                    },
                    error => {
                        if (errorCallback != null)
                            errorCallback(error);
                        reject(error);
                    }
                )
        });
    }
    doPut(endpoint:string,body, successCallback, errorCallback,isEndpointAbsolute = false) {
        let that = this;
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.put(endpoint,body, {headers: contentHeaders})
                .subscribe(
                    response => {
                        localStorage.setItem('VERSION_CACHE_HEADER',response.headers.get('Cookie'));
                        that.valideVersion();
                        if (successCallback != null)
                            successCallback(response);
                        resolve(response.json());
                    },
                    error => {
                        if (errorCallback != null)
                            errorCallback(error);
                        reject(error);
                    }
                )
        });
    }

    onSave(endpoint:string, body,list, errorCallback = null,isEndpointAbsolute = false) {
        let that = this;
        let successCallback= response => {
            if(list != null)
                list.unshift( response.json());
            if (that.toastyService)
                that.addToast('Notificacion','Guardado con éxito');
        };
        return this.doPost(endpoint,body,successCallback,errorCallback,isEndpointAbsolute)
    }

    onLoadList(endpoint:string, list,max, errorCallback = null,isEndpointAbsolute = false) {
        let that = this;
        let successCallback= response => {
            Object.assign(list, response.json());
        };
        return this.doGet(endpoint,successCallback,errorCallback,isEndpointAbsolute);
    }

    onDelete(endpoint:string,id, list ,errorCallback = null,isEndpointAbsolute = false) {
        let that = this;
        let successCallback= response => {
            if(list != null){
                let index = list.findIndex(obj => obj.id == id);
                if(index!=-1)
                    list.splice(index,1);
            }
            if (that.toastyService)
                that.addToast('Notificacion','Borrado con éxito');
        };
        this.doDelete(endpoint,successCallback,errorCallback,isEndpointAbsolute);
    }
    onUpdate(endpoint:string,body,data, errorCallback = null,isEndpointAbsolute = false){
        let that = this;
        let successCallback= response => {
            Object.assign(data, response.json());
            if (that.toastyService)
                that.addToast('Notificacion','Actualizado con éxito');
        };
       return this.doPut(endpoint,body,successCallback,errorCallback,isEndpointAbsolute)
    }
    
    valideVersion(){
        if(localStorage.getItem('VERSION_CACHE') && localStorage.getItem('VERSION_CACHE_HEADER'))
            if(localStorage.getItem('bearer') && (localStorage.getItem('VERSION_CACHE') != localStorage.getItem('VERSION_CACHE_HEADER')))
            {
                localStorage.setItem('VERSION_CACHE',localStorage.getItem('VERSION_CACHE_HEADER'));
                location.reload(true);
            }
    }
}