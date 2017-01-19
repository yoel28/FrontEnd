import {HttpUtils} from "./http-utils";
import {OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {DependenciesBase} from "../com.zippyttech.common/DependenciesBase";
import {ToastOptions, ToastData} from "ng2-toasty";

export interface IWhere {
    [index:number]: WhereOp |{ and:IWhere } |{ or:IWhere }  | { join:string; where:IWhere };
}

interface WhereOp {
    op:string;
    field:string;
    value?:string | boolean | number;
    type?:string;
}

export interface IRest{
    where:IWhere;
    max:number;
    offset:number;
}

export class RestController implements OnInit {

    dataList:any = [];
    httputils:HttpUtils;
    endpoint:string;
    offset = 0;
    max = 15;
    sort = "";//name field.
    order = "";//asc o desc
    deleted = "";//all | only
    page:any = [];
    where:string = "";
    whereObject:IWhere=[];
    id='';
    findData:boolean=false;
    rest:IRest= {
        'where': [],
        'max': 15,
        'offset': 0,
    }

    constructor(public db:DependenciesBase | any) {
        this.httputils = new HttpUtils(db.http,db.toastyService,db.toastyConfig);
    }
    ngOnInit() {
    }
    loadRest(){
        this.setWhere(this.rest.where);
        this.max  = this.rest.max;
        this.offset  = this.rest.offset;
    }

    setEndpoint(endpoint:string) {
        this.endpoint = endpoint;
    }
    public setWhere(where:IRest | Object):void{
        if(where){
            this.where = "&where="+encodeURI(JSON.stringify(where).split('{').join('[').split('}').join(']'));
        }
    }

    addToast(title,message,type='info',time=10000) {

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
                this.db.toastyConfig.position='top-right';
                this.db.toastyService.info(toastOptions);
                break;
            case 'success':
                this.db.toastyService.success(toastOptions);
                break;
            case 'wait':
                this.db.toastyService.wait(toastOptions);
                break;
            case 'error':
                this.db.toastyConfig.position='bottom-center';
                this.db.toastyService.error(toastOptions);
                break;
            case 'warning':
                this.db.toastyService.warning(toastOptions);
                break;
        }
    }

    error = err => {
        //this.sound(err.status);
        let that = this;
        this.findData = false;
        if (that.db.toastyService) {
            try {
                if (err.json()) {
                    if (err.json().message && err.json().message.error)
                        that.addToast('error', err.json().message.error, 'error');
                    else if (err.json()._embedded && err.json()._embedded.errors) {
                        err.json()._embedded.errors.forEach(obj => {
                            that.addToast('error', obj.message, 'error');
                        })
                    }
                    else if (err.json().message) {
                        that.addToast('error', err.json().message, 'error');
                    }
                    else if (err.json().errors) {
                        err.json().errors.forEach(obj => {
                            that.addToast('error', obj.message, 'error');
                        })
                    }
                    else {
                        that.addToast('error', err.json(), 'error');
                    }
                }
                else {
                    that.addToast('error',err,'error');
                }
            }catch (e){
                if(err.statusText)
                    that.addToast('error', err.statusText, 'error');
                else if(err.status)
                    that.addToast('error', err.status, 'error');
                else
                    that.addToast('error', e, 'error');
            }

        }
        console.log(err);

    }

    sound(id) {
        var audio = {};
        audio['500'] = new Audio();
        audio['404'] = new Audio();
        audio['422'] = new Audio();
        audio['default'] = new Audio();

        audio['500'].src = "assets/audio/500.mp3";
        audio['404'].src = "assets/audio/404.mp3";
        audio['422'].src = "assets/audio/422.mp3";
        audio['default'].src = "assets/audio/default.mp3";

        if (audio[id])
            audio[id].play();
        else
            audio['default'].play();

    }

    getOffset(offset?, list?, max?) {
        var _count = ( list ? list.count : this.dataList.count);
        var _max = (max | this.max);

        if (typeof offset === 'number')
            this.offset = _max * (offset - 1);
        else {
            if (offset == '<')
                this.offset = this.offset - _max;
            else if (offset == '<<')
                this.offset = 0;
            else if (offset == '>')
                this.offset = this.offset + _max;
            else if (offset == '>>')
                this.offset = (Math.ceil(_count / _max) - 1) * _max;
            else
                this.offset = 0;
        }
    }

    loadPager(list) {
        list['page'] = [];
        if (list.count && list.count > 0) {
            let initPage = Math.trunc((this.offset + this.max) / (this.max * 5)) * 5;
            let count = 0;
            let maxPage = Math.ceil(list.count / this.max);
            if (initPage > 1)
                list.page.push('<<', '<', initPage);
            while (count < 5 && maxPage > (initPage + count)) {
                count++;
                list.page.push(initPage + count)
            }
            if (maxPage > (initPage + count))
                list.page.push('>', '>>');
            if (maxPage > 1)
                list.page.push('#');
        }
    }

    loadData(offset?,event?) {
        if(event)
            event.preventDefault();
        this.findData = true;
        let that = this;
        if (offset && offset == '#')
            that.getLoadDataAll([], null, null, 0, 1000, null);
        else {
            this.getOffset(offset);
            return this.httputils.onLoadList(this.endpoint +this.id + "?max=" + this.max + "&offset=" + this.offset + this.where + (this.sort.length > 0 ? '&sort=' + this.sort : '') + (this.order.length > 0 ? '&order=' + this.order : '') + (this.deleted.length > 0 ? '&deleted=' + this.deleted : ''), this.dataList, this.max, this.error).then(
                response=> {
                    that.loadPager(that.dataList);
                    this.findData=false;
                }, error=> {
                    console.log("error");
                }
            );
        }
    };

    onloadData(endpoint?, list?, offset?, max?, where?) {
        let that = this;

        if (offset && offset == '#')
            return that.getLoadDataAll([], endpoint, list, 0, 1000, where);
        else {
            this.getOffset(offset, list, max);
            return this.httputils.onLoadList((endpoint || this.endpoint) + "?max=" + (max || this.max) + "&offset=" + (this.offset) + (where || this.where) + (this.sort.length > 0 ? '&sort=' + this.sort : '') + (this.order.length > 0 ? '&order=' + this.order : ''), (list || this.dataList), this.max, this.error).then(
                response=> {
                    that.loadPager(list || that.dataList);
                }, error=> {
                    console.log("error");
                }
            );
        }
    };

    getLoadDataAll(data, endpoint?, list?, offset?, max?, where?, successCallback?) {
        let that = this;

        endpoint = ( endpoint ? endpoint : that.endpoint);
        list = (list ? list : that.dataList);
        max = (max ? max : that.max);
        where = (where ? where : that.where);
        list.page = [];
        return this.httputils.onLoadList(endpoint + "?max=" + max + "&offset=" + offset + where, list, max, this.error).then(
            response=> {
                if (list.count > 0) {
                    data = data.concat(list.list);
                    if (list.count == list.list.length || list.count == data.length) {
                        Object.assign(list.list, data);
                        if (successCallback)
                            successCallback();
                    }
                    else if (max > list.list.length) {
                        max = list.list.length;
                        that.getLoadDataAll(data, endpoint, list, offset + max, max, where, successCallback);
                    }
                    else {
                        that.getLoadDataAll(data, endpoint, list, offset + max, max, where, successCallback);
                    }
                }

            }, error=> {
                console.log("error");
            }
        );
    }

    onUpdate(event, data) {
        event.preventDefault();
        if (data[event.target.accessKey] != event.target.innerHTML) {
            //data[event.target.accessKey] = event.target.innerHTML;
            let json = {};
            json[event.target.accessKey] = event.target.innerHTML;
            let body = JSON.stringify(json);
            this.httputils.onUpdate(this.endpoint + data.id, body, data, this.error);
        }
    }

    onDelete(event = null, id) {
        if (event)
            event.preventDefault();
        this.httputils.onDelete(this.endpoint + id, id, this.dataList.list, this.error);
    }

    onSave(data:FormGroup|Object,successCallback?) {
        let body:any;
        if(data instanceof FormGroup)
            body = JSON.stringify(data.value);
        else
            body = JSON.stringify(data);

        return this.httputils.onSave(this.endpoint, body, this.dataList.list, this.error).then(
            response=>{
                if(successCallback)
                    successCallback(response);
            }
        );
    }

    onPatch(field, data, value?) {
        let json = {};
        json[field] = value ? value : !data[field];
        let body = JSON.stringify(json);
        return (this.httputils.onUpdate(this.endpoint + data.id, body, data, this.error));
    }

    onPatchValue(field, data, value=null) {
        let json = {};
        json[field] = value;
        let body = JSON.stringify(json);
        return (this.httputils.onUpdate(this.endpoint + data.id, body, data, this.error));
    }

    onLock(field, data, event) {
        if (event)
            event.preventDefault();
        let json = {};
        json[field] = !data[field];
        let body = JSON.stringify(json);
        return (this.httputils.onUpdate("/lock" + this.endpoint + data.id, body, data, this.error));
    }

    onEditable(field, data, value, endpoint) {
        let json = {};
        let that = this;
        if (typeof data[field] === "number")
            value = parseFloat(value);
        json[field] = value;
        let body = JSON.stringify(json);

        let successCallback = response => {
            that.addToast('Notificacion','Guardado con éxito');
        };
        return (this.httputils.doPut(endpoint+data.id,body,successCallback,this.error));
    }

    onEditableRole(field, data, value, endpoint) {
        let json = {};
        let that=this;
        json[field] = value;
        let body = JSON.stringify(json);
        let successCallback = response => {
            that.addToast('Notificacion','Guardado con éxito');
        };
        return (this.httputils.doPost(endpoint, body, successCallback, this.error));
    }

    assignData(data) {
        this.dataList.list.unshift(data);
        if (this.dataList.page.length > 1)
            this.dataList.list.pop();
    }

    setNull(data, key) {
        let json = {};
        json[key] = null;
        let body = JSON.stringify(json);
        return (this.httputils.onUpdate(this.endpoint + data.id, body, data, this.error));
    }

    onPatchId(data, key, dataSelect) {
        let json = {};
        json[key] = data.id;
        let body = JSON.stringify(json);
        return (this.httputils.onUpdate(this.endpoint + dataSelect.id, body, dataSelect, this.error));
    }

    loadWhere(where,event?) {
        if(event)
            event.preventDefault();
        this.where = where;
        this.loadData();
    }
    loadDataWhere(id='',where:IWhere=[]){
        let that = this;
        this.findData = true;
        if(id && id!='')
            this.id = id;
        this.where="&where="+encodeURI(JSON.stringify(where).split('{').join('[').split('}').join(']'));
        let successCallback= response => {
            that.findData=false;
            Object.assign(that.dataList, response.json());
            if(!(id && id==''))
                that.loadPager(that.dataList);
        };
        return this.httputils.doGet(this.endpoint+id+'?offset=0'+this.where,successCallback,this.error);
    }

    changeOrder(sort){
        if(sort ==  this.sort){
            this.order = this.order=='asc'?'desc':'asc';
        }
        else
        {
            this.sort =  sort;
            this.order = 'desc'
        }
        this.loadData();
    }

    public setDataField(id,key,value?,callback?,data?){
        let json = {};
        json[key] = value || null;
        let body = JSON.stringify(json);
        return (this.httputils.onUpdate(this.endpoint + id, body,{}).then(response=>{
            if(callback)
                callback(response,data);
        }));
    }
    changeDeleted(event){
        if(event)
            event.preventDefault();
        if(this.deleted==''){
            this.deleted = 'all';
        }
        else if(this.deleted=='all'){
            this.deleted = 'only';
        }
        else if(this.deleted=='only'){
            this.deleted = '';
        }
        this.loadData();
    }

}
