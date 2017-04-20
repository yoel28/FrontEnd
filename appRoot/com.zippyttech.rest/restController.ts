import {HttpUtils} from "./http-utils";
import {EventEmitter} from "@angular/core";
import {FormGroup, FormControl} from "@angular/forms";
import {DependenciesBase} from "../com.zippyttech.common/DependenciesBase";

export interface IData{
    list?:Array<Object>;
    count?:number;
    page?:Array<number | string>;
}

export interface IWhere {
    [index:number]: WhereOp |{ and:IWhere;code?:string } |{ or:IWhere;code?:string }  | { join:string; where:IWhere;code?:string };
}

interface WhereOp {
    op:string;
    field:string;
    value?:string | boolean | number;
    type?:string;
    code?:string
}

type orderOptions = 'desc'|'asc';
type deletedOptions = 'all'|'only';
export type typeToast = 'info'|'success' | 'wait' | 'error' | 'warning';

export interface IRest{
    where:IWhere;
    max:number;
    offset:number;
    whereDefault?:IWhere;
    findData?:boolean;
    sort?:string;
    order?:orderOptions;
    deleted?:deletedOptions;
    id?:string;
    data:FormControl;
}

export interface IRestEvent{
    type:string;
    args:Object;
}

export class RestController {
    public events:EventEmitter<IRestEvent>;

    httputils:HttpUtils;
    endpoint:string;
    rest:IRest= {
        where: [],
        max: 15,
        offset: 0,
        findData:false,
        data:new FormControl({})
    };
    restSearch:IRest= {
        where: [],
        max: 5,
        offset: 0,
        findData:false,
        data:new FormControl({})
    };

    constructor(public db:DependenciesBase) {
        this.httputils = new HttpUtils(this.db);
    }

    get dataList():IData | any{
        return this.rest.data.value;
    }
    set dataList(data:IData | any){
        this.rest.data.setValue(data);
    }

    private data(search=false):FormControl{
        return this.getRest(search).data;
    }


    get dataSearch():IData |any{
        return this.restSearch.data.value;
    }
    set dataSearch(data:IData | any){
        this.restSearch.data.setValue(data);
    }

    public getRestParams(search = false):string{
        let rest = this.getRest(search);
        return  rest.id?rest.id:'' +
                "?max=" + rest.max +
                "&offset=" + rest.offset +
                this.setWhere(rest.where) +
                (rest.sort ?'&sort=' + rest.sort : '') +
                (rest.order?'&order=' + rest.order : '') +
                (rest.deleted?'&deleted=' + rest.deleted : '');

    }

    protected setEndpoint(endpoint:string) {
        if(endpoint.substr(0, 1) == "/" && endpoint.substr(-1) == "/"){
            this.endpoint = endpoint;
            return;
        }
        this.db.debugLog('Error setEndpoint','Debe iniciar y terminar con el caracter /')

    }
    protected getEndpoint(search=false):string{
        if(search)
            return '/search'+this.endpoint;
        return this.endpoint;
    }

    public getData(search = false):IData | any{
        return search?this.dataSearch:this.dataList;
    }
    public setData(data:IData | any,search = false){
        if(search)
            this.restSearch.data.setValue(data);
        else
            this.rest.data.setValue(data);
    }


    public getRest(search = false):IRest{
        return search?this.restSearch:this.rest;
    }

    private setWhere(where:IRest | Object,prefix='&where='):string{
        if(where){
            return prefix+encodeURI(JSON.stringify(where).split('{').join('[').split('}').join(']'));
        }
        return prefix+encodeURI('[]');
    }
    public  loadWhere(where:IWhere,event?,code?:string,search:boolean = false) {
        if(event)
            event.preventDefault();
        if(code)
            this.removedCodeFilter(code);

        if(typeof where === 'object'){

            if((<any>where).length){
                let whereTemp:IWhere;
                whereTemp = (<any>this.getRest(search).where).concat(where);
                this.getRest(search).where = whereTemp;
            }
        }
        else
            console.log('no es un objecto.. verificar');
        this.loadData();
    }
    public  removedCodeFilter(code:string,search=false){
        let indexs=[];
        let rest = this.getRest(search);

        if(rest.where){
            (<any>rest.where).forEach((where,index)=>{
                if(where.code && where.code ==  code)
                    indexs.unshift(index);
            });
        }
        indexs.forEach(i=>{
            (<any>rest.where).splice(i,1);
        })
    }

    public changeOrder(sort:string,search=false){
        if(sort ==  this.getRest(search).sort){
            this.getRest(search).order = this.getRest(search).order=='desc'?'asc':null;
            if(!this.getRest(search).order)
                this.getRest(search).sort=null;
        }
        else
        {
            this.getRest(search).sort =  sort;
            this.getRest(search).order = 'desc'
        }
        this.loadData(1,search);
    }
    public changeDeleted(event?,search=false){
        if(event)
            event.preventDefault();
        this.getRest(search).deleted = (!this.getRest(search).deleted)?'all':(this.getRest(search).deleted=='all')?'only':null;
        this.loadData(1,search);
    }

    private sound(id:string) {
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

    private getOffset(list:IData,rest:IRest,offset?:number|string) {
        let _count = list.count || 0;
        let _max = rest.max;

        if (typeof offset === 'number')
            rest.offset = _max * (offset - 1);
        else {
            if (offset == '<')
                rest.offset = rest.offset - _max;
            else if (offset == '<<')
                rest.offset = 0;
            else if (offset == '>')
                rest.offset = rest.offset + _max;
            else if (offset == '>>')
                rest.offset = (Math.ceil(_count / _max) - 1) * _max;
            else
                rest.offset = 0;
        }
    }

    private loadPager(search=false) {
        let rest = this.getRest(search);
        let list  = this.getData(search);
        list.page = [];
        if (list.count && list.count > 0) {
            let initPage = Math.trunc((rest.offset + rest.max) / (rest.max * 5)) * 5;
            let count = 0;
            let maxPage = Math.ceil(list.count / rest.max);
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
        this.data(search).setValue(list);
    }

    public assignData(data:Object) {
        this.getData().list.unshift(data);
        this.getData().count++;
        if (this.getData().page.length > 1)
            this.getData().list.pop();
    }

    public error = err => {
        //this.sound(err.status);
        this.getRest().findData = false;
        this.getRest(true).findData = false;

        if (this.db.toastyService) {
            try {
                if(err.status==0){
                    this.httputils.addToast('error', 'Por favor verifique su conexion a Internet', 'error');
                }
                else if (err.json()) {
                    if (err.json().message && err.json().message.error)
                        this.httputils.addToast('error', err.json().message.error, 'error');
                    else if (err.json()._embedded && err.json()._embedded.errors) {
                        err.json()._embedded.errors.forEach(obj => {
                            this.httputils.addToast('error', obj.message, 'error');
                        })
                    }
                    else if (err.json().message) {
                        this.httputils.addToast('error', err.json().message, 'error');
                    }
                    else if (err.json().errors) {
                        err.json().errors.forEach(obj => {
                            this.httputils.addToast('error', obj.message, 'error');
                        })
                    }
                    else {
                        this.httputils.addToast('error', err.json(), 'error');
                    }
                }
                else {
                    this.httputils.addToast('error',err,'error');
                }
            }catch (e){
                if(err.statusText)
                    this.httputils.addToast('error', err.statusText, 'error');
                else if(err.status)
                    this.httputils.addToast('error', err.status, 'error');
                else
                    this.httputils.addToast('error', e, 'error');
            }

        }
        console.log(err);

    };


    public loadData(offset?:string|number,search:boolean=false,event?:Event) {
        if(event)
            event.preventDefault();

        let rest = this.getRest(search);
        rest.findData = true;
        if (offset && offset == '#'){
            rest.offset = 0;
            rest.max = 1000;
            return this.getLoadDataAll([], this.getEndpoint(search), this.data(search), this.getRest(search));
        }
        else {
            this.getOffset(this.getData(search),this.getRest(search),offset);
            return this.httputils.onLoadList(this.getEndpoint(search)+this.getRestParams(search), this.data(search), this.error).then(
                (response=> {
                    this.loadPager(search);
                    rest.findData=false;
                }).bind(this)
            );
        }
    };
    public loadDataId(id:string,search=false){
        this.getRest(search).id = id;
        this.loadData(null,search);
    }
    private getLoadDataAll(data:Array<Object>, endpoint:String, control:FormControl, rest:IRest, successCallback?) {
        let list:Object = control.value;//TODO:YR-falta
        list['page'] = [];
        control.setValue(list);
        rest.findData = true;
        return this.httputils.onLoadList(endpoint + "?max=" + rest.max + "&offset=" + rest.offset + this.setWhere(rest.where), control, this.error).then(
            (response=> {
                if (list['count'] > 0) {
                    data = data.concat(list['list']);
                    if (list['count'] == list['list'].length || list['count'] == data.length) {
                        rest.findData=false;
                        control.setValue(data);
                        if (successCallback)
                            successCallback();
                    }
                    else if (rest.max > list['list'].length) {
                        rest.max = list['list'].length;
                        rest.offset+= rest.max;
                        control.setValue(list);
                        this.getLoadDataAll(data, endpoint, control, rest, successCallback);
                    }
                    else {
                        rest.offset+= rest.max;
                        this.getLoadDataAll(data, endpoint, control, rest, successCallback);
                    }
                }

            }).bind(this)
        );
    }


    public onUpdate(event, data) {//TODO: Creo que no esta en uso
        event.preventDefault();
        if (data[event.target.accessKey] != event.target.innerHTML) {
            let json = {};
            json[event.target.accessKey] = event.target.innerHTML;
            let body = JSON.stringify(json);
            this.httputils.onUpdate(this.getEndpoint() + data.id, body, data, this.error);
        }
    }
    public onDelete(id:number,successCallback?,event = null) {
        if (event)
            event.preventDefault();

        return this.httputils.onDelete(this.getEndpoint() + id, id, this.getData().list, this.error).then((response=>{
                if(successCallback)
                    successCallback(response);
                this.events.emit({type:'onDelete',args:response});
            }).bind(this)
        );
    }
    public onSave(data:FormGroup|Object,successCallback?) {
        let body:any;
        if(data instanceof FormGroup)
            body = JSON.stringify(data.value);
        else
            body = JSON.stringify(data);

        return this.httputils.onSave(this.getEndpoint(), body, this.getData().list, this.error).then((response=>{
                if(successCallback)
                    successCallback(response);
                this.events.emit({type:'onSave',args:response});
            })
        );
    }

    public onPatchObject(body:Object,data:Object,successCallback?) {
        return (this.httputils.onUpdate(this.getEndpoint()+ data['id'],JSON.stringify(body), data, this.error).then((response=>{
                if(successCallback)
                    successCallback(response);
                this.events.emit({type:'onPatch',args:response});
            })
        ));
    }
    public onPatch(field:string, data:Object, value?:string | boolean | number,successCallback?) {
        let json = {};
        json[field] = value ? value : !data[field];
        let body = JSON.stringify(json);
        return (this.httputils.onUpdate(this.getEndpoint() + data['id'], body, data, this.error).then((response=>{
                if(successCallback)
                    successCallback(response);
                this.events.emit({type:'onPatch',args:response});
            })
        ));
    }
    public onPatchValue(field:string, data:Object, value=null,successCallback?) {
        let json = {};
        json[field] = value;
        return (this.httputils.onUpdate(this.getEndpoint() + data['id'], JSON.stringify(json), data, this.error).then((response=>{
                if(successCallback)
                    successCallback(response);
                this.events.emit({type:'onPatch',args:response});
            })
        ));
    }
    public onPatchNull(data:Object, key:string,successCallback?) {
        let json = {};
        json[key] = null;
        return (this.httputils.onUpdate(this.getEndpoint() + data['id'], JSON.stringify(json), data, this.error).then((response=>{
                if(successCallback)
                    successCallback(response);
                this.events.emit({type:'onPatch',args:response});
            })
        ));
    }
    public onPatchId(dataRef:Object, key:string, data:Object,successCallback?) {
        let json = {};
        json[key] = data['id'];
        return (this.httputils.onUpdate(this.getEndpoint() + dataRef['id'], JSON.stringify(json), data, this.error).then((response=>{
                if(successCallback)
                    successCallback(response);
                this.events.emit({type:'onPatch',args:response});
            })
        ));
    }
    public onPatchProfile(field:string, data:Object, value=null,event?,successCallback?) {
        if(event)
            event.preventDefault();
        let json = {};
        json[field] = value;
        return (this.httputils.onUpdate('/auto/update', JSON.stringify(json), data, this.error).then((response=>{
                if(successCallback)
                    successCallback(response);
                this.events.emit({type:'onPatch',args:response});
            })
        ));
    }


    public onLock(field:string, data:Object, event?,successCallback?) {
        if (event)
            event.preventDefault();
        let json = {};
        json[field] = !data[field];
        return (this.httputils.onUpdate("/lock" + this.getEndpoint() + data['id'], JSON.stringify(json), data, this.error).then((response=>{
                if(successCallback)
                    successCallback(response);
                this.events.emit({type:'onLock',args:response});
            })
        ));
    }

    onEditable(field, data, value, endpoint) {
        let json = {};
        let that = this;
        if (typeof data[field] === "number")
            value = parseFloat(value);
        json[field] = value;
        let body = JSON.stringify(json);

        let successCallback = response => {
            Object.assign(data,response.json());
            that.httputils.addToast('Notificación','Guardado con éxito');
        };
        if(endpoint == '/auto/update')
            return (this.httputils.doPut(endpoint,body,successCallback,this.error));
        else
            return (this.httputils.doPut(endpoint+data.id,body,successCallback,this.error));
    }

    onEditableRole(field, data, value, endpoint) {
        let json = {};
        let that=this;
        json[field] = value;
        let body = JSON.stringify(json);
        let successCallback = response => {
            that.httputils.addToast('Notificación','Guardado con éxito');
        };
        return (this.httputils.doPost(endpoint, body, successCallback, this.error));
    }

    //region get

    public loadDataExternal(endpoint:string,data:Object,isEndpointAbsolute:boolean=false,successCallback) {
        if(!successCallback)
            successCallback= response => {
                Object.assign(data,response);
            };
        return this.httputils.doGet(endpoint,successCallback,this.error,isEndpointAbsolute);
    };

    //endregion

}
