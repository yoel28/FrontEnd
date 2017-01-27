import {Component, EventEmitter, OnInit, DoCheck} from '@angular/core';
import { Http} from '@angular/http';
import {RestController} from "../../../com.zippyttech.rest/restController";
import {StaticValues} from "../../../com.zippyttech.utils/catalog/staticValues";
import {ToastyService, ToastyConfig} from "ng2-toasty";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
declare var SystemJS:any;
@Component({
    selector: 'search-multiple-view',
    templateUrl: SystemJS.map.app+'/com.zippyttech.ui/components/searchMultiple/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.ui/components/searchMultiple/style.css'],
    inputs:['params'],
    outputs:['result','getInstance'],
})
export class SearchMultipleComponent extends RestController implements OnInit,DoCheck{

    public params:any={};
    public result:any;
    public getInstance:any;

    constructor(public db:DependenciesBase) {
        super(db);
        this.result = new EventEmitter();
        this.getInstance = new EventEmitter();
    }
    ngOnInit(){
        this.rest.max = 5;
        this.setEndpoint(this.params.endpoint);
    }
    getSearch(search){
        this.endpoint=this.params.endpoint+search;
        this.rest.where = this.params.where || [];
        this.loadData();
    }
    ngDoCheck():void{
        this.getInstance.emit(this);
    }
    getData(event){
        if(event)
            event.preventDefault();
        let data=[];
        this.params.valuesData.forEach(obj=>{
            data.push(obj.id)
        });

        this.result.emit(data);
    }
    addValue(event,id){
        if(event)
            event.preventDefault();
        this.params.valuesData.push(id);
    }
    deleteValue(event,id){
        if(event)
            event.preventDefault();
        let index = this.params.valuesData.findIndex((obj:any) =>obj.id == id );
        if(index>-1)
            this.params.valuesData.splice(index,1);
    }
    existValue(id){
        let index = this.params.valuesData.findIndex((obj:any) =>obj.id == id );
        if(index > -1)
            return true;
        return false;
    }
}

