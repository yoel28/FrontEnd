import {ElementRef, Directive, EventEmitter, OnInit} from "@angular/core";
import {FormControl} from "@angular/forms";

var jQuery = require('jquery');
var colorpicker = require('colorpicker');

@Directive({
    selector: "[color-picker]",
    inputs:['hexControl','hexString'],
    outputs:['color']
})
export class ColorPicker implements OnInit{
    public hide:any;
    public hexControl:FormControl;
    public hexString:String;
    public color:any;

    constructor(public element:ElementRef) {
        this.hexControl = new FormControl('');
        this.color = new EventEmitter();
    }
    ngOnInit(){
        let that = this;
        let _color = (that.hexControl.value || this.hexString);
        if((_color && _color=='') || !_color)
        {
            _color='000000';
        }

        jQuery(this.element.nativeElement).ColorPicker({
            color: _color,
            onShow: function (colpkr) {
                jQuery(colpkr).fadeIn(500);
                return false;
            },
            onHide: function (colpkr) {
                that.color.emit(that.hexControl.value || that.hexString);
                jQuery(colpkr).fadeOut(500);
                return false;
            },
            onChange: function (hsb, hex, rgb) {
                that.hexControl.setValue(hex);
                that.hexString=hex;
                jQuery(that.element.nativeElement).css('backgroundColor', '#' + (that.hexControl.value || this.hexString));
                jQuery(that.element.nativeElement).val('#'+(that.hexControl.value || this.hexString));
            }
        })
        jQuery(that.element.nativeElement).css('backgroundColor', '#' + _color);
        jQuery(that.element.nativeElement).val('#'+_color);
    }
}