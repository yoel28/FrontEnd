import {Component, EventEmitter, OnInit, AfterViewInit} from "@angular/core";
import {RestController} from "../../../com.zippyttech.rest/restController";
import {FormComponent} from "../form/form.component";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
var moment = require('moment');
var jQuery = require('jquery');
@Component({
    moduleId: module.id,
    selector: 'save-view',
    templateUrl: 'index.html',
    styleUrls: ['style.css'],
    inputs:['model','childKey'],
    outputs:['getInstance']
})
export class SaveComponent extends RestController implements OnInit,AfterViewInit{

    public childKey:string;
    private childModel:any;
    public model:any;
    private getInstance:EventEmitter<any>;
    public instanceForm:FormComponent;
    public actions:any;

    private get currentModel(){return this.childModel || this.model}

    constructor(public db:DependenciesBase) {
        super(db);
        this.getInstance = new EventEmitter();
    }
    ngOnInit(){
        if(this.childKey && this.model.rules[this.childKey] )
            this.childModel = this.model.rules[this.childKey].model;
    }
    setForm(form){
        this.instanceForm=form
    }
    ngAfterViewInit(){
        this.getInstance.emit(this);
    }

    submitForm(event,addBody=null){

        let that = this;
        let successCallback= response => {
            that.addToast('Notificacion','Guardado con éxito');
            that.instanceForm.resetForm();
            if(this.childKey && this.childModel)
                this.model.afterSave(this.childKey,this.model.currentData,response.json().id);
        };
        this.setEndpoint(this.currentModel.paramsSave.endpoint);
        let body = this.instanceForm.getFormValues(addBody);
        if(this.currentModel.paramsSave.updateField)
            this.httputils.onUpdate(this.endpoint+this.instanceForm.rest.id,JSON.stringify(body),this.instanceForm.dataSelect,this.error);
        else
            this.httputils.doPost(this.endpoint,JSON.stringify(body),successCallback,this.error);

    }
    formActions(){
        if(this.currentModel.paramsSave.updateField)
            return [{'title':'Actualizar','class':'btn btn-blue','icon':'fa fa-save','addBody':null}];

        if(this.currentModel.paramsSave.customActions && this.currentModel.paramsSave.customActions.length > 0)
            return this.currentModel.paramsSave.customActions;

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
        this.setEndpoint(this.currentModel.paramsSave.endpoint);
        this.onDelete(event,this.instanceForm.rest.id);
    }
}

