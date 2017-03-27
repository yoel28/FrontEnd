import {Component, EventEmitter, OnInit, AfterViewInit} from "@angular/core";
import {RestController} from "../../../com.zippyttech.rest/restController";
import {FormComponent} from "../form/form.component";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {ModelRoot} from "../../../com.zippyttech.common/modelRoot";

var moment = require('moment');
var jQuery = require('jquery');

export interface ISave{
    model:ModelRoot;
    childKey?:string;
    onlyRequired?:boolean;
}

@Component({
    moduleId: module.id,
    selector: 'save-view',
    templateUrl: 'index.html',
    styleUrls: ['style.css'],
    inputs:['params'],
    outputs:['getInstance']
})
export class SaveComponent implements OnInit,AfterViewInit{

    public params:ISave;
    public instanceForm:FormComponent;
    public save:EventEmitter<Object>;
    public getInstance:EventEmitter<SaveComponent>;
    public childModel?:ModelRoot;
    public update?:boolean;


    constructor(public db:DependenciesBase) {
        this.save = new EventEmitter();
        this.getInstance = new EventEmitter<SaveComponent>();
    }

    ngOnInit(){
        this.loadModels();
    }

    setForm(form:FormComponent){
        this.instanceForm=form
    }

    ngAfterViewInit(){
        this.getInstance.emit(this);
    }

    private loadModels(){
        if(this.params && this.params.model && this.params.model instanceof ModelRoot){

            if(this.params.childKey){
                if(
                    this.params.model[this.params.childKey] &&
                    this.params.model[this.params.childKey].model &&
                    this.params.model[this.params.childKey].model instanceof ModelRoot
                )
                {
                    return this.params.model[this.params.childKey].model;
                }
                this.db.debugLog(['Error:02 SaveComponent -> loadModels',this.params.childKey,this.params.model]);
                return;
            }

        }
        this.db.debugLog(['Error:01 SaveComponent -> loadModels',this.params.childKey,this.params.model]);

    }

    private get currentModel():ModelRoot{
        return (this.childModel || this.params.model);
    }

    private get currentRules():Object{
        return this.currentModel? this.currentModel.rules:{};
    }

    private submitForm(event?,addBody=null){
        if(event)
            event.preventDefault();

        let successCallback = (response => {
            this.currentModel.addToast('Notificacion','Guardado con éxito');
            this.instanceForm.resetForm();
            this.save.emit(response.json());
            if(this.params.childKey)//TODO:Arreglar
                this.params.model.afterSave(this.params.childKey,this.params.model.currentData,response.json().id);
        }).bind(this);
        let body = this.instanceForm.getFormValues(addBody);
        if(!this.update)
            this.currentModel.onSave(body,successCallback);
        else
            this.currentModel.onPatchObject(body,this.currentModel['currentData']);

    }
    formActions(){
        if(this.update)
            return [{'title':'Actualizar','class':'btn btn-blue','icon':'fa fa-save','addBody':null}];

        return [{'title':'Registrar','class':'btn btn-primary','icon':'fa fa-save','addBody':null}]
    }

    formValid():boolean{
        if(this.instanceForm && this.instanceForm.form){
            return this.instanceForm.isValidForm();
        }
        return false;
    }

    setLoadDataModel(data,_delete=false) {
        this.instanceForm.setLoadDataModel(data,_delete);
    }

    existloadSearch():boolean{

        if(this.instanceForm && this.instanceForm.search && this.instanceForm.search.object){
            return this.instanceForm.searchView;
        }
        return false;
    }

    existloadDelete():boolean {

        if(this.instanceForm && this.instanceForm.delete && this.instanceForm.rest.id && parseFloat(this.instanceForm.rest.id || '-1')>0 ){
            return true;
        }
        return false;
    }

    loadDelete(event){
        if(event)
            event.preventDefault();
        this.currentModel.onDelete(event,this.currentModel.rest.id);
    }

}

