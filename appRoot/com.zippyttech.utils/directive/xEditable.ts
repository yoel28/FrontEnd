import {ElementRef, EventEmitter, OnInit, Directive} from "@angular/core";
import {HttpUtils} from "../../com.zippyttech.rest/http-utils";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {RestController} from "../../com.zippyttech.rest/restController";

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
    inputs: ['data', 'rules', 'field', 'function', 'endpoint','disabled'],
    outputs: ['success']
})
export class XEditable extends RestController implements OnInit {
    public success:any;
    public data:any = {};
    public rules:any = {};
    public field:string;
    public endpoint:string;
    public function:any;
    public httputils:HttpUtils;
    public disabled:boolean;

    constructor(public el:ElementRef, public db:DependenciesBase) {
        super(db);
        this.success = new EventEmitter();
        this.httputils = new HttpUtils(db.http,db.toastyService,db.toastyConfig);
    }

    ngOnInit() {

        let currentRule = this.getRule;


        jQuery(this.el.nativeElement).editable({

            type: this.getType(currentRule),
            value: this.getValue(currentRule),
            disabled: this.getDisabled(currentRule),
            display: this.getDisplay(currentRule),
            showbuttons: this.getShowbuttons(currentRule),
            mode: this.getMode(currentRule),
            source:this.getSource(currentRule),
            format:this.getFormat(currentRule),
            viewformat:this.getViewFormat(currentRule),
            template:this.getTemplate(currentRule),
            step:this.getStep(currentRule),
            combodate: this.getCombodate(currentRule),

            validate: function (newValue) {
                if(this.function)
                {
                    this.function(this.field, this.data, newValue, this.endpoint).then(
                        function (value) {
                            this.eventSetValue(currentRule,value[this.field]);
                        }.bind(this), function (reason) {
                            this.eventSetValue(currentRule);
                        }.bind(this)
                    );
                }
                this.success.emit(newValue);
            }.bind(this)
        });
    }
    private get getRule(){
        return this.rules[this.field];
    }

    private getType(rule){
        switch (rule.type) {
            case "url" :
                return 'url';
            default :
                return rule.type || 'text'
        }
    }

    private getValue(rule){
        switch (this.getType(rule)) {
            case "combodate" :
                return this.data[this.field];
            case "password" :
                return '';
            case "url" :
                return 'link';
            default :
                return (rule.subKey?( this.data[this.field][rule.subKey] || 'N/A' ):( this.data[this.field] || "N/A"));
        }
    }

    private getDisabled(rule){
        return this.disabled;
    }

    private getDisplay(rule){
        return rule.display || null
    }

    private getShowbuttons(rule){
        switch (this.getType(rule)) {
            case "combodate" :
                return rule.showbuttons == null?true:rule.showbuttons;
            case "textarea" :
                return rule.showbuttons==null?true:rule.showbuttons;
            default :
                return rule.showbuttons || false;
        }
    }

    private getMode(rule){
        switch (this.getType(rule)) {
            case "combodate" :
                return rule.mode || 'popup';
            case "textarea" :
                return rule.mode || 'popup';
            default :
                return rule.mode || 'inline';
        }
    }

    private getSource(rule){
        return rule.source || null
    }

    private getFormat(rule){
        switch (this.getType(rule)) {
            case "combodate" :
                if(rule.date == 'date'){
                    return rule.format || 'DD-MM-YYYY'
                }
                if(rule.date == 'datetime'){
                    return rule.format || 'YYYY-MM-DD HH:mm'
                }
            default :
                return null;
        }
    }

    private getViewFormat(rule){
        switch (this.getType(rule)) {
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

    private getTemplate(rule){

        switch (this.getType(rule)) {
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

    private getStep(rule){
        return rule.step || "0.001"
    }

    private getCombodate(rule){
        switch (this.getType(rule)) {
            case "combodate" :
                return {
                        minYear: parseFloat(this.db.myglobal.getParams('MIN_DATE') || '2000'),
                        maxYear: parseFloat(this.db.myglobal.getParams('MAX_DATE') || '2020'),
                    };
            default :
                return null;
        }

    }

    private eventSetValue(rule,data=null){
        switch (this.getType(rule)) {
            case "url" :
                jQuery(this.el.nativeElement).editable('setValue','link', true);
            default :
                jQuery(this.el.nativeElement).editable('setValue',( data || this.data[this.field]), true);
        }
    }




}