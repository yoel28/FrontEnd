import {Component, EventEmitter, OnInit, AfterViewInit} from "@angular/core";
import {RestController} from "../../../com.zippyttech.rest/restController";
import {FormComponent} from "../form/form.component";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";

var moment = require('moment');
var jQuery = require('jquery');

@Component({
    moduleId:module.id,
    selector: 'save-view',
    templateUrl: 'index.html',
    styleUrls: [ 'style.css'],
    inputs:['params','rules'],
    outputs:['save','getInstance'],
})
export class SaveComponent extends RestController implements OnInit,AfterViewInit{

    public params:any={};
    public rules:any={};

    public instanceForm:FormComponent;
    public save:any;
    public getInstance:any;
    public actions:any;

    constructor(public db:DependenciesBase) {
        super(db);
        this.save = new EventEmitter();
        this.getInstance = new EventEmitter();
    }
    ngOnInit(){

    }
    setForm(form){
        this.instanceForm=form
    }
    ngAfterViewInit(){
        this.getInstance.emit(this);
        if(this.params.prefix && !this.db.myglobal.objectInstance[this.params.prefix])
        {
            this.db.myglobal.objectInstance[this.params.prefix]={};
            this.db.myglobal.objectInstance[this.params.prefix]=this;
        }
    }

    submitForm(event,addBody=null){

        let that = this;
        let successCallback= response => {
            that.addToast('Notificacion','Guardado con éxito');
            that.instanceForm.resetForm();
            that.save.emit(response.json());
        };
        this.setEndpoint(this.params.endpoint);
        let body = this.instanceForm.getFormValues(addBody);
        if(this.params.updateField)
            this.httputils.onUpdate(this.endpoint+this.instanceForm.rest.id,JSON.stringify(body),this.instanceForm.dataSelect,this.error);
        else
            this.httputils.doPost(this.endpoint,JSON.stringify(body),successCallback,this.error);
    }
    formActions(){
        if(this.params.updateField)
            return [{'title':'Actualizar','class':'btn btn-blue','icon':'fa fa-save','addBody':null}];

        if(this.params.customActions && this.params.customActions.length > 0)
            return this.params.customActions;

        return [{'title':'Registrar','class':'btn btn-primary','icon':'fa fa-save','addBody':null}]
    }

    formValid():boolean{
        if(this.instanceForm && this.instanceForm.form){
            return this.instanceForm.isValidForm();
        }
        return false;
    }
    setLoadDataModel(data,_delete=false)
    {
        this.instanceForm.setLoadDataModel(data,_delete);
    }
    existloadSearch():boolean{
        if(this.instanceForm && this.instanceForm.search && this.instanceForm.search.object){
            return this.instanceForm.searchView;
        }
        return false;
    }
    existloadDelete():boolean{
        if(this.instanceForm && this.instanceForm.delete && this.instanceForm.rest.id && parseFloat(this.instanceForm.rest.id || '-1')>0 ){
            return true;
        }
        return false;
    }
    loadDelete(event){
        if(event)
            event.preventDefault();
        this.setEndpoint(this.params.endpoint);
        this.onDelete(event,this.instanceForm.rest.id);
    }
}

