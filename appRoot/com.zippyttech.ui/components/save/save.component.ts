import {Component, EventEmitter, OnInit, AfterViewInit} from "@angular/core";
import {FormComponent} from "../form/form.component";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {ModelRoot} from "../../../com.zippyttech.common/modelRoot";

export interface ISave{
    model:ModelRoot;
    childKey?:string;
    onlyRequired?:boolean;
    update?:boolean;
}

@Component({
    selector: 'save-view',
    templateUrl: './index.html',
    styleUrls: ['./style.css'],
    inputs:['params'],
    outputs:['getInstance']
})
export class SaveComponent implements OnInit,AfterViewInit{

    public params:ISave;
    public instanceForm:FormComponent;
    public save:EventEmitter<Object>;
    public getInstance:EventEmitter<SaveComponent>;
    public childModel?:ModelRoot;


    constructor(public db:DependenciesBase) {
        this.save = new EventEmitter();
        this.getInstance = new EventEmitter<SaveComponent>();
    }

    ngOnInit(){
        this.initChildModel();
        console.log(this.params.model);
        console.log(this.childModel);
        console.log(this.params.childKey);

    }

    setForm(form:FormComponent){
        this.instanceForm=form;
    }

    ngAfterViewInit(){
        this.getInstance.emit(this);
    }

    private initChildModel(){
        if(this.params && this.params.model && this.params.model instanceof ModelRoot)
            if(this.params.childKey)
                if(
                    this.params.model.rules[this.params.childKey] &&
                    this.params.model.rules[this.params.childKey].model &&
                    this.params.model.rules[this.params.childKey].model instanceof ModelRoot
                )
                {
                    this.childModel = this.params.model.rules[this.params.childKey].model;
                }
                else this.db.debugLog(['Error:02 SaveComponent -> loadModels',this.params.childKey,this.params.model]);
        else this.db.debugLog(['Error:01 SaveComponent -> loadModels',this.params.childKey,this.params.model]);
    }

    private get currentModel():ModelRoot{
        return this.childModel || this.params.model;
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
        if(!this.params.update)
            this.currentModel.onSave(body,successCallback);
        else
            this.currentModel.onPatchObject(body,this.currentModel['currentData']);
        if(this.db.ms.currentModal == 'save')
            this.db.ms.hideCurrentModal();
    }

    formActions(){
        if(this.params.update)
            return [{'title':'Actualizar','class':'btn btn-blue','icon':'fa fa-save','addBody':null}];

        return [{'title':'Registrar','class':'btn btn-primary','icon':'fa fa-save','addBody':null}]
    }

    formValid():boolean{
        if(this.instanceForm && this.instanceForm.form)
            return this.instanceForm.isValidForm();
        return false;
    }

    setLoadDataModel(data,_delete=false) {
        this.instanceForm.setLoadDataModel(data,_delete);
    }

    existloadSearch():boolean{
        if(this.instanceForm && this.instanceForm.search && this.instanceForm.search.object)
            return this.instanceForm.searchView;
        return false;
    }

    existloadDelete():boolean {
        if(this.instanceForm && this.instanceForm.delete && this.instanceForm.rest.id && parseFloat(this.instanceForm.rest.id || '-1')>0 )
            return true;
        return false;
    }

    loadDelete(event){
        if(event)
            event.preventDefault();
        this.currentModel.onDelete(event,this.currentModel.rest.id);
        if(this.db.ms.currentModal == 'save')
            this.db.ms.hideCurrentModal();
    }

}

