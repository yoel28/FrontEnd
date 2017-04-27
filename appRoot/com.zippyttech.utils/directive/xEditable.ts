import {ElementRef, OnInit, Directive} from "@angular/core";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {ModelRoot} from "../../com.zippyttech.common/modelRoot";
import {TRules} from "../../app-routing.module";
import {API} from "../catalog/defaultAPI";
import {Editable} from "../../com.zippyttech.common/rules/editable.types";

var jQuery = require('jquery');
var bootstrap = require('bootstrap');
var moment = require('moment');
var editable = require('editable');

/**
 * @Params API
 * Optional
 *      MIN_DATE
 *      MAX_DATE
 *
 *
 */

@Directive({
    selector: "[x-editable]",
    inputs: ['model','key', 'data','disabled','endpoint'],
})
export class XEditable implements OnInit {

    public disabled:boolean;
    public model:ModelRoot;
    public key:string;
    public data:Object;



    constructor(public el:ElementRef, public db:DependenciesBase) {}

    ngOnInit() {

        let currentRule = this.getRule;


        jQuery(this.el.nativeElement).editable({

            type: this._getType(currentRule),
            value: this._getValue(currentRule),
            defaultValue: this._getDefaultValue(currentRule),
            disabled: this._getDisabled(currentRule),
            display: this._getDisplay(currentRule),
            showbuttons: this._getShowbuttons(currentRule),
            mode: this._getMode(currentRule),
            source:this._getSource(currentRule),
            format:this._getFormat(currentRule),
            viewformat:this._getViewFormat(currentRule),
            template:this._getTemplate(currentRule),
            step:this._getStep(currentRule),
            combodate: this._getCombodate(currentRule),
            placement:this._getPlacement(currentRule),

            validate: (newValue) =>{
                let msg = this._getIsValid(currentRule,newValue);
                if(msg)
                    return msg;

                newValue = this._fnParseValueValidate(currentRule,newValue);

                this.model.onPatch(this.key,this.data,newValue).then(
                    (value)=> {
                        this._evSetValue(currentRule,value[this.key]);
                    },
                    (reason) => {
                        this._evSetValue(currentRule);
                    }
                );
            }
        });
    }

    private get getRule():TRules{
        return this.model.rules[this.key];
    }

    private _getType(rule):string{
        let type = rule.type;
        switch (type) {
            case "url" :
                return 'url';
            case "object":
                return rule.mode;
            default :
                return type || 'text'
        }
    }

    private _getValue(rule){
        switch (this._getType(rule)) {
            case "combodate" :
                if(this.data[this.key])
                    return moment(this.data[this.key]);
                return this.data[this.key];
            case "password" :
                return '';
            case "url" :
                return 'link';
            default :
                return (rule.subKey?( this.data[this.key][rule.subKey] || 'N/A' ):( this.data[this.key] || "N/A"));
        }
    }

    private _getDefaultValue(rule){
        switch (this._getType(rule)) {
            case "combodate" :
                return null;
            case "password" :
                return '';
            case "url" :
                return 'link';
            default :
                return 'N/A';
        }
    }

    private _getDisabled(rule){
        return this.disabled;
    }

    private _getDisplay(rule){
        return rule.display || null
    }

    private _getShowbuttons(rule){
        if(this._getMode(this.getRule) == 'popup')
            return true;

        switch (this._getType(rule)) {
            case "combodate" :
                return true;
            case "textarea" :
                return true;
            case "object":{
                if(rule.mode == 'checklist')
                    return true;
            }
            case "checklist":
                return true;
            default :
                return rule.showbuttons || false;
        }
    }

    private _getMode(rule){
        switch (this._getType(rule)) {
            case "combodate" :
                return rule.mode || 'popup';
            case "textarea" :
                return rule.mode || 'popup';
            default :
                return rule.mode || 'inline';
        }
    }

    private _getSource(rule){
        return rule.source || null
    }

    private _getFormat(rule){
        switch (this._getType(rule)) {
            case "combodate" :
                if(rule.date == 'date'){
                    return rule.format || 'YYYY-MM-DD'
                }
                if(rule.date == 'datetime'){
                    return rule.format || 'YYYY-MM-DD HH:mm'
                }
            default :
                return null;
        }
    }

    private _getViewFormat(rule){
        switch (this._getType(rule)) {
            case "combodate" :
                if(rule.date == 'date'){
                    return rule.viewformat || 'MMM D, YYYY';
                }
                if(rule.date == 'datetime'){
                    return rule.viewformat || 'MMM D, YYYY, HH:mm';
                }
            default :
                return null;
        }
    }

    private _getTemplate(rule){

        switch (this._getType(rule)) {
            case "combodate" :
                if(rule.date == 'date'){
                    return rule.template || 'D MMM YYYY';
                }
                if(rule.date == 'datetime'){
                    return rule.template || 'D MMM YYYY  HH:mm';
                }
            default :
                return null;
        }

    }

    private _getStep(rule){
        return rule.step || "0.001"
    }

    private _getCombodate(rule){
        switch (this._getType(rule)) {
            case "combodate" :
                return {
                        minYear: this.db.myglobal.getParams('MIN_DATE',API.MIN_DATE),
                        maxYear: this.db.myglobal.getParams('MAX_DATE',API.MAX_DATE),
                    };
            default :
                return null;
        }

    }
    private _getPlacement(rule){
        return (<Editable>this.getRule).placement || 'top';
    }

    private _evSetValue(rule,data=null){
        switch (this._getType(rule)) {
            case "url" :
                jQuery(this.el.nativeElement).editable('setValue','link', true);
            case "combodate" :
                if(data)
                    return moment(data);
                return data;
            default :
                jQuery(this.el.nativeElement).editable('setValue',( data || this.data[this.key]), true);
        }
    }

    private _getIsValid(rule,newValue){
        if(rule.required && !newValue)
            return this.db.msg.required;

        if(rule.maxLength && newValue && newValue.length > rule.maxLength )
            return this.db.msgParams('errorMaxlength',[rule.maxLength]);

        if(rule.minLength && newValue && newValue.length < rule.minLength )
            return this.db.msgParams('errorMinlength',[rule.minLength]);

    }

    private _fnParseValueValidate(rule,newValue){
        switch (this._getType(rule)) {
            case "combodate" :
                if(rule.date == 'date'){
                    return newValue.format('YYYY-MM-DD');
                }
                if(rule.date == 'datetime'){
                    return newValue.format('YYYY-MM-DD HH:mmZZ');
                }
            default :
                return newValue;
        }
    }


}