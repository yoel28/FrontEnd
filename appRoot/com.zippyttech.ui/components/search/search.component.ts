import {Component, EventEmitter, OnInit} from '@angular/core';
import {IData, IRest} from '../../../com.zippyttech.rest/restController';
import {DependenciesBase} from '../../../com.zippyttech.common/DependenciesBase';
import {ModelRoot} from '../../../com.zippyttech.common/modelRoot';
import {FormControl, FormGroup} from '@angular/forms';
import {API} from '../../../com.zippyttech.utils/catalog/defaultAPI';
import {StaticValues} from '../../../com.zippyttech.utils/catalog/staticValues';

export interface ISearch {
    model: ModelRoot;
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
    public output: EventEmitter<Object>;

    private _form: FormGroup;


    constructor(public db: DependenciesBase) {
        this.output = new EventEmitter();
    }

    ngOnInit() {
        this._initForm();
    }


    getDataAll(data) {
        this.output.emit(data);
    }

    private get _static(): Object {
        return StaticValues;
    }

    private get _search(): string {
        return this._model.nameClass;
    }


    // region model

    private get _model(): ModelRoot {
        return this.params.model;
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
        if (event)
            event.preventDefault();

        this._searchRest.id = this._getFormValue();
        this._model.loadData(page, true);
    }

    private _destroySearch(event?: Event) {
        this.db.ms.hideCurrentModal();
    }

    private get _searchPage() {
        if (this._model) {
            return this._model.getCurrentPage(true);
        }
        return -1;
    }

    private _fnSearch(data: Object) {
        this.output.emit(data);
        this.db.ms.hideCurrentModal();
    }

    // endregion

    // region form

    private _initForm() {

        let field = new FormControl('');

        this._form = new FormGroup({});
        this._form.addControl('value', field);

        field.valueChanges
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

