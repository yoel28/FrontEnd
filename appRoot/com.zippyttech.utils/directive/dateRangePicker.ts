import {ElementRef, Directive, EventEmitter, OnInit} from "@angular/core";

let jQuery = require('jquery');
let moment = require('moment');
let daterangepicker = require('daterangepicker');

@Directive({
    selector: "[date-range-picker]",
    inputs:['params'],
    outputs:['fecha']
})
export class DateRangePicker implements OnInit {
    public params:any={};
    public fecha:any;
    public element:any;
    constructor(public el: ElementRef) {
        this.fecha = new EventEmitter();
    }
    ngOnInit(){
        let that = this;
        that.element = jQuery(this.el.nativeElement).daterangepicker({
                showDropdowns: true,
                minDate:that.params.minDate
            },
            function(start, end) {
                that.fecha.emit({'start':start.format(that.params.format),'end':end.add(1,'day').format(that.params.format)})
            });
        jQuery(that.element).on('cancel.daterangepicker', function(ev, picker) {
            that.fecha.emit(null);
        });
    }
}