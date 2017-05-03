import {Component, EventEmitter, OnInit, AfterViewInit} from "@angular/core";
import  {FormControl, Validators, FormGroup} from '@angular/forms';
import {IData, IRest} from "../../../com.zippyttech.rest/restController";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {API} from "../../../com.zippyttech.utils/catalog/defaultAPI";
import {UrlRule} from "../../../com.zippyttech.common/rules/url.rule";
import {TRules} from "../../../app-routing.module";
import {ModelRoot} from "../../../com.zippyttech.common/modelRoot";
import {IIncludeComponents} from "../../../com.zippyttech.common/rules/rule";
import {ObjectRule} from "../../../com.zippyttech.common/rules/object.rule";
import {Actions} from "../../../com.zippyttech.init/app/app.types";
import {ITagsInput} from "../../../com.zippyttech.utils/directive/tagsinput";
import {StaticValues} from "../../../com.zippyttech.utils/catalog/staticValues";

type TTypeAction = 'search' | 'internal';
type TTypeForm = 'save' | 'filter';

interface IFieldActions{
    [key:string]:IDataAction
}

interface IDataAction{
    view?:boolean;
    type?:TTypeAction,
    valid?:boolean;
    touch?:boolean;
    id?:number;
    value?:string;
}

@Component({
    selector: 'form-view',
    templateUrl: './index.html',
    styleUrls: [ './style.css'],
    inputs:['model','type'],
    outputs:['getInstance'],
})

export class FormComponent implements OnInit,AfterViewInit {

    private _type: TTypeForm = 'save';
    private _search: string;
    private _actions: IFieldActions = {};
    private _form: FormGroup;

    public model: ModelRoot;
    public getInstance: EventEmitter<FormComponent>;

    constructor(public db: DependenciesBase) {
        this.getInstance = new EventEmitter<FormComponent>();
    }

    //region hooks ng

    ngOnInit() {
        this.initForm();
    }

    ngAfterViewInit() {
        this.getInstance.emit(this);
    }

    //endregion

    //region actions

    initAction(key: string, type: TTypeAction) {
        this._actions[key] = {
            view: true,
            type: type,
        };
        if (type == 'search')
            this._initSearch(key);
    }

    private _destroyAction(event?: Event) {
        if (event)
            event.preventDefault();
        if (this._search)
            this._destroySearch();
    }

    private _addAction(key: string, data: any) {
        this._getAction(key).value = data;
        this._getAction(key).id = data.id;
        this._getAction(key).valid = true;
        this._getAction(key).view = false;
        this._getAction(key).touch = false;
    }

    private _getAction(key: string): IDataAction {
        return this._actions[key] || {};
    }

    private _fnDisabledAction(key: string) {
        this._getAction(key).touch = false;
        this._getAction(key).valid = false;
    }

    private _getActionsRule(rule: TRules): Actions<IIncludeComponents>[] {
        let keys = [];
        if (rule.actions) {
            Object.keys(rule.actions.getAll).forEach(key => {
                if (rule.actions.get(key).params[this._type] && rule.actions.get(key).permission)
                    keys.push(rule.actions.get(key));
            })
        }
        return keys;
    }

    private _includeInForm(key:string[]){

    }

    //endregion

    //region search

    private _initSearch(key: string) {
        if (this._getRule(key).type == 'object') {
            this._search = key;
            this._loadDataSearch();
            return;
        }
        this.db.debugLog('FormComponent', 'initSearch', 'not object', this._getRule(key));
    }

    private _destroySearch(event?:Event) {
        if(event)
            event.preventDefault();

        if (!this._getAction(this._search).valid)
            this._fnDisabledAction(this._search);
        this._search = null;
    }

    private _loadDataSearch(event?: Event, page: number = 1) {
        if (event)
            event.preventDefault();

        let action = this._getAction(this._search);
        let rule = this._getRule(this._search);

        if (action.view && action.type == 'search') {
            (<ObjectRule>rule).model.getRest(true).id = this.getFormValue(this._search);
            (<ObjectRule>rule).model.loadData(page, true);
        }
    }

    private _fnSearchQuit(event: Event) {
        if (event)
            event.preventDefault();
        this._destroySearch();
    }

    private _fnSaveSearch(key:string,data:any){
        this._addAction(key,data);
        this._setFormValue(key,data.title || data.detail);
        this._search = null;
    }

    private get _searchData(): IData {
        let rest = this._searchRest;
        if (rest && rest.data && rest.data.value) {
            return rest.data.value
        }
        return {};
    }

    private get _searchModel(): ModelRoot {
        if(this._getRule(this._search) instanceof ObjectRule)
            return (<ObjectRule>this._getRule(this._search)).model;
        return null;
    }

    private get _searchRest(): IRest {
        let rule = this._getRule(this._search);
        if (rule && (<ObjectRule>rule).model) {
            return (<ObjectRule>rule).model.getRest(true);
        }
        return null;
    }

    private get _searchPage(): number {
        let rule = this._getRule(this._search);
        if (rule && (<ObjectRule>rule).model) {
            return (<ObjectRule>rule).model.getCurrentPage(true);
        }
        return -1;
    }



    //endregion

    //region form

    initForm() {
        let rule: TRules;
        let validators = [];
        let include: boolean = false;
        let onlyRequired = false;

        this._form = new FormGroup({});
        if (this._type == 'save' && this.model.view.components && this.model.view.components.form)
            onlyRequired = this.model.view.components.form.onlyRequired || false;

        Object.keys(this.model.rules).forEach((key) => {

            rule = this._getRule(key);
            include = rule.include[this._type];

            if (include && ((onlyRequired && ( rule.required || rule.componentSave.force)) || !onlyRequired)) {

                validators = [];

                if (rule.required)
                    validators.push(Validators.required);

                if (rule.maxLength)
                    validators.push(Validators.maxLength(rule.maxLength));

                if (rule.minLength)
                    validators.push(Validators.minLength(rule.minLength));

                if (rule.type == 'object') {
                    validators.push(
                        (c: FormControl) => {
                            if (c.value && c.value.length > 0) {
                                if (this._getAction(key).valid && !this._getAction(key).touch) {
                                    this._getAction(key).touch = true;
                                    return null;
                                }
                                return rule.componentSave.notReference ? null : {object: {valid: false}};
                            }
                            return null;
                        });
                }

                if (rule.type == 'email') {
                    validators.push(
                        (c: FormControl) => {
                            if (c.value && c.value.length > 0) {
                                let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
                                return EMAIL_REGEXP.test(c.value) ? null : {'email': {'valid': false}};
                            }
                            return null;
                        });
                }

                if (rule.componentSave.validator)
                    validators.push(rule.componentSave.validator);

                if (rule.type == 'select' || rule.type == 'boolean') {
                    validators.push(
                        (c: FormControl) => {
                            if (c.value && c.value.length > 0) {
                                if (c.value != '-1' || (c.value == '-1' && !rule.required)) {
                                    return null;
                                }
                                return {select: {valid: false}};
                            }
                            return null;
                        });
                }

                if (rule.required && rule.type == 'list') {
                    validators.push(
                        (c: FormControl) => {
                            if (c.value && c.value.length > 0) {
                                return null;
                            }
                            return {list: {valid: false}};
                        });
                }

                let field = new FormControl('', Validators.compose(validators));

                if (rule.value)
                    field.setValue(rule.value);


                if (rule.type == 'object') {
                    field.valueChanges
                        .debounceTime(this.db.getParams('WAIT_TIME_SEARCH', API.WAIT_TIME_SEARCH))
                        .subscribe((value: string) => {
                            if (value != null) {
                                if (this._getAction(key).valid && !this._getAction(key).touch) {
                                    return;
                                }
                                this._fnDisabledAction(key);
                                this._loadDataSearch();
                            }
                        });
                }

                if (rule.componentSave.valueChange) {
                    field.valueChanges
                        .debounceTime(this.db.getParams('WAIT_TIME_SAVE', API.WAIT_TIME_SEARCH))
                        .subscribe((value: any) => {
                            this._getRule(key).componentSave.valueChange(this, value);
                        });
                }

                if (this._getRule(key).type == 'url' && (<UrlRule>this._getRule(key)).url == 'image') {
                    field.valueChanges
                        .debounceTime(this.db.getParams('WAIT_TIME_SEARCH', API.WAIT_TIME_SEARCH))
                        .subscribe((value: string) => {
                            let img = new Image();
                            img.onerror = () => {
                                field.setErrors({'image': {'valid': false}});
                            };
                            img.src = value;
                            return null;
                        });
                }

                this._form.addControl(key, field);
            }
        });


    }

    getFormValue(key: string) {
        return this._form.value[key];
    }

    getFormValues(addBody?: Object) {

        let body = Object.assign({}, this._form.value);
        let rule: TRules;

        Object.keys(body).forEach((key: string) => {
            rule = this._getRule(key);
            if (rule) {
                if (body[key] && !body[key].trim().length)
                    body[key] = null;

                if (rule.type == 'object') {
                    if (rule.componentSave.notReference) {
                        body[key] = this._getAction(key).id || body[key];
                    }
                    else {
                        body[key] = this._getAction(key).id || null;
                    }
                }

                if (rule.type == 'number') {
                    body[key] = parseFloat(body[key]);
                }

                if ((rule.type == 'select' || rule.type == 'boolean') && body[key] == "-1") {
                    body[key] = null;
                }

                if (rule.type == 'boolean') {
                    body[key] = body[key] == 'true';
                }

                if (rule.componentSave.prefix && rule.type == 'text') {
                    body[key] = rule.componentSave.prefix + body[key];
                }

                if (rule.componentSave.setEqual) {
                    body[rule.componentSave.setEqual] = body[key];
                }

                if (rule.list) {
                    let data = [];
                    body[key].forEach(obj => {
                        data.push(obj.value || obj);
                    });
                    body[key] = data;
                }

            }
        });

        if (addBody && typeof addBody == 'object') {
            Object.assign(body, addBody);
        }

        return body;
    }

    loadForm(data:Object,_delete=false){
        this.fnResetForm();
        Object.keys(data).forEach(key=>{
            this._setFormValue(key,data[key])
        });
    }

    fnResetForm() {
        this._keysForm.forEach(key => {
            this._getControl(key).setValue(null);
            this._getControl(key).setErrors(null);
            if (this._getRule(key).readOnly)
                this._getRule(key).readOnly = false;
        });
        this._form.reset();
    }

    get valid():boolean{
        return this._form?this._form.valid:false;
    }

    private get _keysForm(): string[] {
        return Object.keys(this._form.controls);
    }

    private _setFormValue(key: string, value: any) {
        if (this._form.contains(key)) {
            this._form.controls[key].setValue(this._getParseValue(key, value));
            return;
        }
        this.db.debugLog('FormComponent', '_setFormValue', 'Not found key ' + key);
    }

    private _fnHiddenFormControl(rule: TRules): boolean {
        if (this._type == 'save' && rule.componentSave.hidden)
            return rule.componentSave.hidden(this);
        return false;
    }

    private _getParseValue(key, value) {
        let rule = this._getRule(key);
        switch (rule.type) {
            case 'select': {
                if (value && value == '-1')
                    return null;
                return value;
            }
            case 'boolean': {
                if (value && value == '-1')
                    return null;
                return value;
            }
            case 'combodate': {
                return value.date;
            }
            default : {
                return value;
            }
        }

    }

    private _getControl(key){
        return this._form.controls[key];
    }

    //endregion

    //region others

    private _fnContainsType(key: string, ...list: string[]): boolean {
        return list.indexOf(this._getRule(key).type) >= 0;
    }

    private _getKeys(data:Object = {}){
        return Object.keys(data || {});
    }

    private get _static(){
        return StaticValues;
    }

    private _getList(key:string):ITagsInput{
        return this._getRule(key).list || null
    }

    private _getRule(key:string):TRules{
        return this.model.rules[key] || {};
    }

    private _fnMakeTextRandon():string {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 20; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    private _fnAddTagManual(event,key){
        if(event)
            event.preventDefault();
        let value=event.target[0].value;
        if(value && value.length)
        {
            event.target[0].value='';
            this._getRule(key).list.instance.fnAdd(
                {
                    'id': -1,
                    'value': value,
                    'title': 'inputManual'
                }
            );
        }
    }

    //endregion


    // @HostListener('keydown', ['$event'])
    // fnKeyboardInput(event: any) {
    //     if(event.code=="Enter" || event.code=="NumpadEnter"){
    //         let key = event.path[0].accessKey;
    //         if(key && this._getRule(key) && this._getRule(key).type == 'object'){
    //             // this.loadAndSetDataSearch(true);
    //         }
    //     }
    // }






}