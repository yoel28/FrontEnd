import {Component, EventEmitter, OnInit} from '@angular/core';
import {IData, IRest} from '../../../com.zippyttech.rest/restController';
import {DependenciesBase} from '../../../com.zippyttech.common/DependenciesBase';
import {ModelRoot} from '../../../com.zippyttech.common/modelRoot';
import {FormControl, FormGroup} from '@angular/forms';
import {API} from '../../../com.zippyttech.utils/catalog/defaultAPI';
import {StaticValues} from '../../../com.zippyttech.utils/catalog/staticValues';
import {ObjectRule} from "../../../com.zippyttech.common/rules/object.rule";

type TEvents = 'data'|'destroy';
export interface ISearch {
    model: ModelRoot;
    key?:string;
    control?:FormControl;
    notHidden?:boolean;
    onAfterSelect?:()=>void;
}
export interface ISearchEvents{
    type:TEvents;
    data?:Object;
}

@Component({
    selector: 'search-view',
    templateUrl: './index.html',
    styleUrls: ['./style.css'],
    inputs: ['params'],
    outputs: ['output'],
})
export class SearchComponent implements OnInit {

    public params: ISearch;
    public output: EventEmitter<ISearchEvents>;

    private _form: FormGroup;

    constructor(public db: DependenciesBase) {
        this.output = new EventEmitter();
    }

    ngOnInit() {
        this._initForm();
    }

    private set _data(value:Object) {
        this.output.emit({type:'data',data:value});
        this._evHidden();
    }

    private get _static(): Object {
        return StaticValues;
    }

    private get _search(): string {
        return this._model.nameClass;
    }

    private _evHidden(){
        if(!this.params.notHidden) {
            this.db.ms.hideCurrentModal();
        }
    }

    // region model

    private get _model(): ModelRoot {
        let key = this.params.key;
        let model = this.params.model;
        if(key) {
            if(model.rules[key] && model.rules[key] instanceof ObjectRule){
                return model.rules[key].model;
            }
            this.db.debugLog('Error SearchComponent','_model','key in model is not instance of ObjectRule',this.params.model,key);
            return;
        }
        return model;
    }

    private get _searchRest(): IRest {
        return this._model.getRest(true);
    }

    private get _searchData(): IData {
        return this._searchRest.data.value
    }

    // endregion

    // region search

    private _loadDataSearch(event?: Event, page: number = 1) {
        if (event) {
            event.preventDefault();
        }
        this._searchRest.id = this._getFormValue();
        this._model.loadData(page, true);
    }

    private _destroySearch(event?: Event) {
        this.output.emit({type:'destroy'});
        this._evHidden();
    }

    private get _searchPage() {
        if (this._model) {
            return this._model.getCurrentPage(true);
        }
        return -1;
    }

    // endregion

    // region form

    private _initForm() {

        if(!this.params.control)
            this.params.control = new FormControl('');

        this._form = new FormGroup({});
        this._form.addControl('value', this.params.control);

        this.params.control.valueChanges
            .debounceTime(this.db.getParams('WAIT_TIME_SEARCH', API.WAIT_TIME_SEARCH))
            .subscribe((value: string) => {
                if (value != null) {
                    this._loadDataSearch();
                }
            });

    }

    private _getFormValue() {
        return this._form.value['value'];
    }

    // endregion
}

