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

interface ISaveComponent{
    parentModel?:ModelRoot;
    childModel?:ModelRoot;
    update?:boolean;
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

    public instanceForm:FormComponent;
    public save:EventEmitter<Object>;
    public getInstance:EventEmitter<SaveComponent>;
    public params:ISave;

    private attributes:ISaveComponent={};

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

            this.attributes.parentModel = this.params.model;

            if(this.params.modelRef){
                if(
                    this.params.model[this.params.modelRef] &&
                    this.params.model[this.params.modelRef].model &&
                    this.params.model[this.params.modelRef].model instanceof ModelRoot
                )
                {
                    this.attributes.childModel = this.params.model[this.params.modelRef].model;
                }
                this.db.debugLog(['Error:02 SaveComponent -> loadModels',this.params.modelRef,this.params.model]);
                return;
            }

        }
        this.db.debugLog(['Error:01 SaveComponent -> loadModels',this.params.modelRef,this.params.model]);

    }

    private get currentModel():ModelRoot{
        return (this.attributes.childModel || this.attributes.parentModel);
    }

    private get parentModel():ModelRoot{
        return this.attributes.parentModel;
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
                this.model.afterSave(this.childKey,this.model.currentData,response.json().id);
        }).bind(this);
        let body = this.instanceForm.getFormValues(addBody);
        if(!this.attributes.update)
            this.currentModel.onSave(body,successCallback);
        else
            this.currentModel.onPatchObject(body,this.currentModel['currentData']);

    }
    formActions(){
        if(this.attributes.update)
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

