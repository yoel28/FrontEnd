import {contentHeaders} from './headers';
import {ToastData, ToastOptions} from 'ng2-toasty';
import {DependenciesBase} from '../com.zippyttech.common/DependenciesBase';
import {typeToast} from './restController';
import {FormControl} from '@angular/forms';

export class HttpUtils {


    constructor(public db: DependenciesBase) {
    }

    private valideVersion() {
        if (localStorage.getItem('VERSION_CACHE') && localStorage.getItem('VERSION_CACHE_HEADER') != 'null')
            if (localStorage.getItem('bearer') && (localStorage.getItem('VERSION_CACHE') != localStorage.getItem('VERSION_CACHE_HEADER'))) {
                localStorage.setItem('VERSION_CACHE', localStorage.getItem('VERSION_CACHE_HEADER'));
                location.reload(true);
            }
    }

    private setCookie(cookie = null) {
        if (cookie && cookie != 'null') {
            localStorage.setItem('VERSION_CACHE_HEADER', cookie);
        }

    }

    public addToast(title: string, message: string, type: typeToast = 'info', time: number = 10000) {

        if (this.db.toastyService) {
            let toastOptions: ToastOptions = {
                title: title,
                msg: message,
                showClose: true,
                timeout: time,
                theme: 'bootstrap',
                onAdd: (toast: ToastData) => {
                    console.log('Toast ' + toast.id + ' has been added!');
                },
                onRemove: function (toast: ToastData) {
                    console.log('Toast ' + toast.id + ' has been removed!');
                }
            };

            switch (type) {
                case 'info':
                    this.db.toastyConfig.position = 'top-right';
                    this.db.toastyService.info(toastOptions);
                    break;
                case 'success':
                    this.db.toastyService.success(toastOptions);
                    break;
                case 'wait':
                    this.db.toastyService.wait(toastOptions);
                    break;
                case 'error':
                    this.db.toastyConfig.position = 'bottom-center';
                    this.db.toastyService.error(toastOptions);
                    break;
                case 'warning':
                    this.db.toastyService.warning(toastOptions);
                    break;
            }
        }
    }

    private createEndpoint(endpoint: string, isAbosulte: boolean = false) {
        return (isAbosulte ? '' : localStorage.getItem('urlAPI')) + endpoint;
    }

    private responseAPI(response, successCallback?) {
        this.setCookie(response.headers.get('Cookie'));
        this.valideVersion();
        if (successCallback != null) {
            let json = response.json();
            try {
                successCallback(json);
            } catch (exception) {
                successCallback(response)
            }
        }

    }

    private errorAPI(error, errorCallback) {
        this.setCookie(error.headers.get('Cookie'));
        this.valideVersion();
        if (errorCallback != null)
            errorCallback(error);
    }


    public doGet(endpoint: string, successCallback, errorCallback, isEndpointAbsolute = false) {
        let that = this;
        endpoint = this.createEndpoint(endpoint, isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.db.http.get(endpoint, {headers: contentHeaders})
                .subscribe(
                    response => {
                        that.responseAPI(response, successCallback);
                        resolve(response);
                    },
                    error => {
                        that.errorAPI(error, errorCallback);
                        reject(error);
                    }
                )
        });
    }

    public doDelete(endpoint: string, successCallback, errorCallback, isEndpointAbsolute = false) {
        let that = this;
        endpoint = this.createEndpoint(endpoint, isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.db.http.delete(endpoint, {headers: contentHeaders})
                .subscribe(
                    response => {
                        that.responseAPI(response, successCallback);
                        resolve(response);
                    },
                    error => {
                        that.errorAPI(error, errorCallback);
                        reject(error);
                    }
                )
        });
    }

    public doPost(endpoint: string, body, successCallback, errorCallback, isEndpointAbsolute = false) {
        let that = this;
        endpoint = this.createEndpoint(endpoint, isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.db.http.post(endpoint, body, {headers: contentHeaders})
                .subscribe(
                    response => {
                        that.responseAPI(response, successCallback);
                        resolve(response);
                    },
                    error => {
                        that.errorAPI(error, errorCallback);
                        reject(error);
                    }
                )
        });
    }

    public doPut(endpoint: string, body, successCallback, errorCallback, isEndpointAbsolute = false) {
        let that = this;
        endpoint = this.createEndpoint(endpoint, isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.db.http.put(endpoint, body, {headers: contentHeaders})
                .subscribe(
                    response => {
                        that.responseAPI(response, successCallback);
                        resolve(response);
                    },
                    error => {
                        that.errorAPI(error, errorCallback);
                        reject(error);
                    }
                )
        });
    }


    public onSave(endpoint: string, body: string, list: Array<Object>, errorCallback = null, isEndpointAbsolute = false) {

        let successCallback = response => {
            if (list != null)
                list.unshift(response);
            if (this.db.toastyService)
                this.addToast('Notificacion', 'Guardado con éxito');
        };
        return this.doPost(endpoint, body, successCallback, errorCallback, isEndpointAbsolute)
    }

    public onLoadList(endpoint: string, list: FormControl, errorCallback = null, isEndpointAbsolute = false) {
        let successCallback = response => {
            list.setValue(response)
        };
        return this.doGet(endpoint, successCallback, errorCallback, isEndpointAbsolute);
    }

    public onDelete(endpoint: string, id: number, list: Array<Object>, errorCallback = null, isEndpointAbsolute = false) {
        let successCallback = response => {
            if (list != null) {
                let index = list.findIndex(obj => obj['id'] == id);
                if (index != -1) {
                    list.splice(index, 1);
                }

            }
            if (this.db.toastyService) {
                this.addToast('Notificacion', 'Borrado con éxito');
            }

        };
        return this.doDelete(endpoint, successCallback, errorCallback, isEndpointAbsolute);
    }

    public onUpdate(endpoint: string, body: string, data: Object, errorCallback = null, isEndpointAbsolute = false) {
        let successCallback = response => {
            Object.assign(data, response);
            if (this.db.toastyService) {
                this.addToast('Notificacion', 'Actualizado con éxito');
            }
        };
        return this.doPut(endpoint, body, successCallback, errorCallback, isEndpointAbsolute)
    }


}