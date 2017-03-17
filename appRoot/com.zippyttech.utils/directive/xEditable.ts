import {ElementRef, EventEmitter, OnInit, Directive} from "@angular/core";
import {HttpUtils} from "../../com.zippyttech.rest/http-utils";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {RestController} from "../../com.zippyttech.rest/restController";

var jQuery = require('jquery');
var bootstrap = require('bootstrap');
var moment = require('moment');
var editable = require('editable');

// Params define
// MIN_DATE
// MAX_DATE

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
        let that = this;
        if(that.disabled==null)
            that.disabled = that.rules[that.field].disabled!=null ? that.rules[that.field].disabled : ( that.data.enabled ? !that.data.enabled : false);

        let currentType = that.rules[that.field].type || 'text';


        jQuery(this.el.nativeElement).editable({
            type: currentType,
            value: that.getValue,
            disabled: that.data.enabled?that.disabled:(that.data.enabled==null?that.disabled:true),
            display: that.rules[that.field].display || null,
            showbuttons: that.rules[that.field].showbuttons || false,

            mode: that.getMode,
            source:that.getSource,
            format:that.getFormat,
            viewformat:that.getViewFormat,
            template:that.getTemplate,
            step:that.getStep,

            combodate: {
                minYear: parseFloat(that.db.myglobal.getParams('MIN_DATE') || '2000'),
                maxYear: parseFloat(that.db.myglobal.getParams('MAX_DATE') || '2020'),
            },
            validate: function (newValue) {
                if(that.function)
                {
                    that.function(that.field, that.data, newValue, that.endpoint).then(
                        function (value) {
                            return;
                        }, function (reason) {
                            jQuery(that.el.nativeElement).editable('setValue', that.data[that.field], true);
                        }
                    );
                }
                that.success.emit(newValue);
            }
        });
    }
    private get getType(){
        return this.getRule.type || 'text'
    }

    private get getRule(){
        return this.rules[this.field];
    }

    private get getFormat(){
        let _currentRule =  this.getRule;

        if (this.getType == 'combodate'){
            if(_currentRule.date == 'date'){
                return _currentRule.format || 'DD-MM-YYYY'
            }
            if(_currentRule.date == 'datetime'){
                return _currentRule.format || 'YYYY-MM-DD HH:mm'
            }
        }
        return null;
    }

    private get getViewFormat(){
        let _currentRule =  this.getRule;

        if (this.getType == 'combodate'){
            if(_currentRule.date == 'date'){
                return _currentRule.viewformat || 'MMM D, YYYY'
            }
            if(_currentRule.date == 'datetime'){
                return _currentRule.viewformat || 'MMM D, YYYY, HH:mm'
            }
        }
        return null;
    }

    private get getTemplate(){
        let _currentRule =  this.getRule;

        if (this.getType == 'combodate'){
            if(_currentRule.date == 'date'){
                return _currentRule.template || 'D MMM YYYY'
            }
            if(_currentRule.date == 'datetime'){
                return _currentRule.template || 'D MMM YYYY  HH:mm'
            }
        }
        return null;
    }

    private get getStep(){
        return this.getRule.step || "0.001"
    }

    private get getSource(){
        return this.getRule.source || null
    }

    private get getMode(){
        return this.getRule.mode || 'inline';
    }

    private get getValue(){
        let _currentRule =  this.getRule;
        switch (this.getType) {
            case "combodate" :
                return this.data[this.field];
            case "password" :
                return '';
            default :
                return (_currentRule.subKey?(this.data[this.field][_currentRule.subKey]):((this.data[this.field]) || "N/A"));
        }
    }


}