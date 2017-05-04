import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';
import {FormComponent} from '../form/form.component';
import {DependenciesBase} from '../../../com.zippyttech.common/DependenciesBase';
import {ModelRoot} from '../../../com.zippyttech.common/modelRoot';
import {TModels, TRules} from '../../../app-routing.module';
import {ObjectRule} from '../../../com.zippyttech.common/rules/object.rule';

export interface ISave {
    model: ModelRoot;
    childKey?: string;
}

@Component({
    selector: 'save-view',
    templateUrl: './index.html',
    styleUrls: ['./style.css'],
    inputs: ['params']
})
export class SaveComponent implements OnInit, AfterViewInit {

    public params: ISave;
    public save: EventEmitter<Object>;

    private _form: FormComponent;
    private _childModel: ModelRoot;


    constructor(public db: DependenciesBase) {
        this.save = new EventEmitter();
    }

    // region hooks ng

    ngOnInit() {
        this._initModelChild();
    }

    ngAfterViewInit() {
    }

    // endregion

    // region  form

    private _setForm(form: FormComponent) {
        this._form = form;
    }

    private _fnFormSubmit(event?: Event) {
        if (event)
            event.preventDefault();

        let successCallback = (response) => {
            this.save.emit(response.json());
            if (this.params.childKey) {
                this._parentModel.onPatch(this.params.childKey, this._parentModel.currentData, response.json().id)
            }

        };

        let body = this._form.getFormValues();
        // if(!this.params.update)
        //     (<ModelRoot>this._currentModel).onSave(body,successCallback);
        // else
        //     (<ModelRoot>this._currentModel).onPatchObject(body,this._currentModel['currentData']);

        (<ModelRoot>this._currentModel).onSave(body, successCallback);
        if (this.db.ms.currentModal == 'save')
            this.db.ms.hideCurrentModal();
    }

    private _fnFormValid(): boolean {
        if (this._form && this._form.valid)
            return this._form.valid;
        return false;
    }


    // endregion

    // region others

    private _getRule(key: string): TRules {
        return this.params.model.rules[key] || {};
    }


    // endregion

    // region models

    private _initModelChild() {
        if (this.params && this.params.model && this.params.model instanceof ModelRoot) {
            let child = this.params.childKey;
            if (child) {
                if ((<ObjectRule>this._getRule(child)).model instanceof ModelRoot) {
                    this._childModel = (<ObjectRule>this._getRule(child)).model;
                    return;
                }
                this.db.debugLog('Error:02 SaveComponent -> loadModels', this.params.childKey, this.params.model);
            }
            return;
        }
        this.db.debugLog('Error:01 SaveComponent -> loadModels', this.params.childKey, this.params.model);

    }

    private get _currentModel(): TModels {
        return this._childModel || this.params.model;
    }

    private get _parentModel(): ModelRoot {
        return this.params.model;
    }

    // endregion


    formActions() {
        // if(this.params.update)
        //     return [{'title':'Actualizar','class':'btn btn-blue','icon':'fa fa-save','addBody':null}];

        return [{'title': 'Registrar', 'class': 'btn btn-primary', 'icon': 'fa fa-save', 'addBody': null}]
    }


    setLoadDataModel(data, _delete = false) {
        // this.instanceForm.setLoadDataModel(data,_delete);
    }

    existloadDelete(): boolean {
        // if(this.instanceForm && this.instanceForm.id && parseFloat(this.instanceForm.getRest().id || '-1')>0 )
        //     return true;
        return false;
    }

    loadDelete(event) {
        if (event)
            event.preventDefault();
        (<ModelRoot>this._currentModel).onDelete(event, (<ModelRoot>this._currentModel).getRest().id);
        if (this.db.ms.currentModal == 'save')
            this.db.ms.hideCurrentModal();
    }

}

