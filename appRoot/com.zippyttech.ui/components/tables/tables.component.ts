import {Component, EventEmitter, OnInit, NgModule} from "@angular/core";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {IRuleView} from "../ruleView/ruleView.component";
import {IModal} from "../modal/modal.component";
import {ModelRoot} from "../../../com.zippyttech.common/modelRoot";


declare var SystemJS:any;
declare var moment:any;

@Component({
    selector: 'tables-view',
    templateUrl: SystemJS.map.app+'/com.zippyttech.ui/components/tables/index.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/components/tables/style.css'],
    inputs:['model'],
    outputs:['getInstance'],
})
export class TablesComponent implements OnInit {

    public model:ModelRoot;

    public paramsData:IRuleView={
        select:{},
        searchParams:{},
        searchInstances:{},
        viewListData:{},
        ruleReference:{},
        locationParams:null
    };

    public modalLocation:IModal={
        id:'modalLocation',
        header:{
            title:'Ubicación'
        },
        global:{
            size:'modal-lg'
        }
    };

    public getInstance:any;
    private _currentPage: number;

    constructor(public db:DependenciesBase) {
        this._currentPage = -1;
        this.getInstance = new EventEmitter();
    }

    ngOnInit() {
        this.getListObjectNotReferenceSave();
    }

    ngAfterViewInit() {
        this.getInstance.emit(this);
    }

    public get currentPage(){
        if(this._currentPage = -1)
            this._currentPage = (this.model.rest.offset/this.model.rest.max)+1;
        return this._currentPage;
    }

    public set currentPage(value:number){
        this._currentPage = value;
        this.model.loadData(value);
    }

    setInstanceSearch(type,instance){
        this.paramsData.searchInstances[type] =  instance;
    }

    private keyVisible() {
        let data=[];
        let that=this;
        Object.keys(this.model.rules).forEach((key)=>{
            if(that.model.rules[key].visible)
                data.push(key)
        });
        return data;
    }

    public modelSave:any={};
    getListObjectNotReferenceSave(){
        let that = this;
        Object.keys(this.model.rules).forEach(key=>{
            if(that.model.rules[key].object && !that.model.rules[key].reference && that.model.rules[key].permissions.add)
                that.modelSave[key]=that.model.rules[key];
        })
    }

    getDataSave(data,key){
        this.model.onPatch(this.modelSave[key].key,this.paramsData.select,data.id);
    }

    getDataSearch(data){
        this.model.onPatch(this.paramsData.searchParams['field'],this.paramsData.select,data.id);
    }

    getDataSearchMultiple(data){
        this.model.onPatch(this.paramsData.searchParams['field'],this.paramsData.select,data);
    }

    public get getModelActions() {
        let data=[];
        Object.keys(this.model.getActions).forEach(((key)=>
        {
            if(this.model.getActions[key].permission)
                data.push(this.model.getActions[key]);
        }).bind(this));
        return data;
    }

    getObjectKeys(data){
        return Object.keys(data || {});
    }

    changeOrder(sort){
        if(sort && this.model && this.model.rules[sort] && this.model.rules[sort].search){
            this.model.changeOrder(sort);
        }
    }

    setDataFieldReference(data,setNull=false) {
        let value=null;
        let that = this;

        if(!setNull)//no colocar valor nulo
        {
            value=this.paramsData.select['id'];
            if(that.paramsData.select[that.paramsData.ruleReference.code]!=null && that.paramsData.ruleReference.unique)
                that.paramsData.ruleReference.model.setDataField(that.paramsData.select[that.paramsData.ruleReference.code],that.model.ruleObject.key,null,that.paramsData.ruleReference.callback,that.paramsData.select).then(
                    response=>{
                        that.paramsData.ruleReference.model.setDataField(data.id,that.model.ruleObject.key,value,that.paramsData.ruleReference.callback,that.paramsData.select);
                    });
            else
                that.paramsData.ruleReference.model.setDataField(data.id,that.model.ruleObject.key,value,that.paramsData.ruleReference.callback,that.paramsData.select);
        }
        else
            that.paramsData.ruleReference.model.setDataField(data[that.paramsData.ruleReference.code],that.model.ruleObject.key,null,that.paramsData.ruleReference.callback,data);

    }

    saveLocation(event){
        if(event)
            event.preventDefault();

        let json={};
        json[this.paramsData.locationParams.keys.lat] =  (this.paramsData.locationParams.data.lat).toString();
        json[this.paramsData.locationParams.keys.lng] =  (this.paramsData.locationParams.data.lng).toString();

        this.model.onPatchObject(json,this.paramsData.select);

    }
}
