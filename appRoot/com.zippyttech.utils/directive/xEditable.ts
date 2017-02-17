import {ElementRef, EventEmitter, OnInit, Directive} from "@angular/core";
import {HttpUtils} from "../../com.zippyttech.rest/http-utils";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {RestController} from "../../com.zippyttech.rest/restController";

var jQuery = require('jquery');
var bootstrap = require('bootstrap');
var moment = require('moment');
var editable = require('editable');

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

        jQuery(this.el.nativeElement).editable({
            type: that.rules[that.field].type || 'text',
            value: (that.rules[that.field].subKey?that.data[that.field][that.rules[that.field].subKey]:that.data[that.field]) || (that.field=='password'?"":"N/A"),
            disabled: that.data.enabled?that.disabled:(that.data.enabled==null?that.disabled:true),
            display: that.rules[that.field].display || null,
            showbuttons: that.rules[that.field].showbuttons || false,
            mode: that.rules[that.field].mode || 'inline',
            source:that.rules[that.field].source || null,
            step:that.rules[that.field].step||"0.001",
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
}