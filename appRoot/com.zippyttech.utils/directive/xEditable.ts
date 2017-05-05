import {Directive, ElementRef, OnInit} from '@angular/core';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';
import {ModelRoot} from '../../com.zippyttech.common/modelRoot';
import {TRules} from '../../app-routing.module';
import {API} from '../catalog/defaultAPI';
import {Editable} from '../../com.zippyttech.common/rules/editable.types';
import {ObjectRule} from '../../com.zippyttech.common/rules/object.rule';
import {BooleanRule} from '../../com.zippyttech.common/rules/boolean.rule';
import {SelectRule} from '../../com.zippyttech.common/rules/select.rule';
import {CombodateRule} from '../../com.zippyttech.common/rules/combodate.rule';
import {NumberRule} from '../../com.zippyttech.common/rules/number.rule';

let jQuery = require('jquery');
let bootstrap = require('bootstrap');
let moment = require('moment');
let editable = require('editable');

/**
 * @Params API
 * Optional
 *      MIN_DATE
 *      MAX_DATE
 *
 *
 */

export interface IXEditable {
    model:ModelRoot;
    key:string;
    data:Object;
    disabled?:boolean;
    endpoint?:((data:Object)=>string)|string;
}

@Directive({
    selector: '[x-editable]',
    inputs: ['params','endpoint'],
})
export class XEditable implements OnInit {

    public params:IXEditable;

    constructor(public el: ElementRef, public db: DependenciesBase) {
    }

    ngOnInit() {

        let currentRule = this.getRule;


        jQuery(this.el.nativeElement).editable({

            type: this._getType(currentRule),
            value: this._getValue(currentRule),
            emptytext: this._getEmptyText(currentRule),
            disabled: this._getDisabled(currentRule),
            showbuttons: this._getShowbuttons(currentRule),
            mode: this._getMode(currentRule),
            source: this._getSource(currentRule),
            format: this._getFormat(currentRule),
            viewformat: this._getViewFormat(currentRule),
            template: this._getTemplate(currentRule),
            step: this._getStep(currentRule),
            combodate: this._getCombodate(currentRule),
            placement: this._getPlacement(currentRule),

            validate: (newValue) => {
                let error = this._getIsValid(currentRule, newValue);
                if (error) {
                    return this.db.getTranslate(error.code, error.params);
                }
                else {
                    newValue = this._fnParseValueValidate(currentRule, newValue);

                    this._model.onPatch(this._key, this._data, newValue).then(
                        (value) => {
                            this._evSetValue(currentRule, value[this._key]);
                        },
                        (reason) => {
                            this._evSetValue(currentRule);
                        }
                    );
                }

            }
        });
    }

    private get _model():ModelRoot {
        return this.params.model;
    }
    private get _key():string {
        return this.params.key;
    }
    private get _disabled():boolean {
        return this.params.disabled;
    }
    private get _data():Object {
        return this.params.data;
    }
    private get _endpoint():string{
        if(typeof this.params.endpoint === 'string' ) {
            return this.params.endpoint;
        }
        if(typeof  this.params.endpoint === 'function'){
            return this.params.endpoint(this._data);
        }
    }


    private get getRule(): TRules {
        return this._model.rules[this._key];
    }

    private _getType(rule: TRules): string {
        let type = rule.type;
        switch (type) {
            case 'url' :
                return 'url';
            case 'object':
                return (<ObjectRule>rule).mode;
            // case 'textarea':
            //     return'wysihtml5';
            default :
                return type || 'text'
        }
    }

    private _getValue(rule: TRules) {
        switch (this._getType(rule)) {
            case 'combodate' :
                if (this._data[this._key])
                    return moment(this._data[this._key]);
                return this._data[this._key];
            case 'password' :
                return '';
            case 'url' :
                return 'link';
            default :
                return this._data[this._key];
        }
    }

    private _getEmptyText(rule: TRules) {
        switch (this._getType(rule)) {
            case 'combodate' :
                return null;
            case 'password':
                return '******';
            case 'url' :
                return 'link';
            case 'object':
                return (<ObjectRule>rule);
            default :
                return (<Editable>rule).emptyText || 'N/A';
        }
    }

    private _getDisabled(rule: TRules) {
        return this._disabled;
    }

    private _getShowbuttons(rule: TRules) {
        if (this._getMode(this.getRule) == 'popup')
            return true;

        switch (this._getType(rule)) {
            case 'combodate' :
                return true;
            case 'textarea' :
                return true;
            case 'object': {
                if ((<ObjectRule>rule).mode == 'checklist')
                    return true;
            }
                break;
            case 'checklist':
                return true;
            default:
                return (<Editable>rule).showbuttons || false;
        }
    }

    private _getMode(rule: TRules) {
        switch (this._getType(rule)) {
            case 'combodate' :
                return (<Editable>rule).mode || 'popup';
            case 'textarea' :
                return (<Editable>rule).mode || 'popup';
            default :
                return (<Editable>rule).mode || 'inline';
        }
    }

    private _getSource(rule: TRules) {
        return (<BooleanRule | SelectRule>rule).source || null
    }

    private _getFormat(rule: TRules) {
        switch (this._getType(rule)) {
            case 'combodate' :
                if ((<CombodateRule>rule).date == 'date') {
                    return (<CombodateRule>rule).format || 'YYYY-MM-DD'
                }
                if ((<CombodateRule>rule).date == 'datetime') {
                    return (<CombodateRule>rule).format || 'YYYY-MM-DD HH:mm'
                }
        }
        return null;
    }

    private _getViewFormat(rule: TRules) {
        switch (this._getType(rule)) {
            case 'combodate' :
                if ((<CombodateRule>rule).date == 'date') {
                    return (<CombodateRule>rule).viewformat || 'MMM D, YYYY';
                }
                if ((<CombodateRule>rule).date == 'datetime') {
                    return (<CombodateRule>rule).viewformat || 'MMM D, YYYY, HH:mm';
                }
        }
        return null;
    }

    private _getTemplate(rule: TRules) {

        switch (this._getType(rule)) {
            case 'combodate' :
                if ((<CombodateRule>rule).date == 'date') {
                    return (<CombodateRule>rule).template || 'D MMM YYYY';
                }
                if ((<CombodateRule>rule).date == 'datetime') {
                    return (<CombodateRule>rule).template || 'D MMM YYYY  HH:mm';
                }
        }
        return null;

    }

    private _getStep(rule: TRules) {
        return (<NumberRule>rule).step || '0.001'
    }

    private _getCombodate(rule: TRules) {
        switch (this._getType(rule)) {
            case 'combodate' :
                return {
                    minYear: (<CombodateRule>rule).minYear || this.db.myglobal.getParams('MIN_DATE', API.MIN_DATE),
                    maxYear: (<CombodateRule>rule).maxYear || this.db.myglobal.getParams('MAX_DATE', API.MAX_DATE),
                };
            default :
                return null;
        }

    }

    private _getPlacement(rule: TRules) {
        return (<Editable>this.getRule).placement || 'top';
    }

    private _evSetValue(rule: TRules, data = null) {
        switch (this._getType(rule)) {
            case 'url' :
                jQuery(this.el.nativeElement).editable('setValue', 'link', true);
                break;
            case 'combodate' :
                if (data)
                    return moment(data);
                return data;
            default :
                jQuery(this.el.nativeElement).editable('setValue', ( data || this._data[this._key]), true);
                break;
        }
    }

    private _getIsValid(rule: TRules, newValue: any): any {

        if (rule.required && !newValue)
            return {code: 'error.required', params: {}};

        if (rule.maxLength && newValue && newValue.length > rule.maxLength)
            return {code: 'error.maxlength', params: {value: rule.maxLength}};

        if (rule.minLength && newValue && newValue.length < rule.minLength)
            return {code: 'error.minlength', params: {value: rule.minLength}};

        return null;
    }

    private _fnParseValueValidate(rule: TRules, newValue: any) {
        switch (this._getType(rule)) {
            case 'combodate' :
                if ((<CombodateRule>rule).date == 'date') {
                    return newValue.format('YYYY-MM-DD');
                }
                if ((<CombodateRule>rule).date == 'datetime') {
                    return newValue.format('YYYY-MM-DD HH:mmZZ');
                }
                break;

        }
        return newValue;
    }

}