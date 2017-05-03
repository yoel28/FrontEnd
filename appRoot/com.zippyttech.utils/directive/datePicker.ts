import {ElementRef, Directive, EventEmitter, OnInit} from "@angular/core";

let jQuery = require('jquery');
let moment = require('moment');
let bootstrap = require('bootstrap');

@Directive({
    selector: "[date-picker]",
    inputs:['format'],
    outputs:['fecha']
})
export class DatePicker implements OnInit {
    // public format={
    //     format: "mm/yyyy",
    //     startView: 2,
    //     minViewMode: 1,
    //     maxViewMode: 2,
    //     todayBtn: "linked",
    //     language: "es",
    //     forceParse: true,
    //     autoclose: true,
    //     todayHighlight: true,
    //     return: 'YYYY/MM',
    // }
    public format:any = {};
    public fecha:any;
    public element:any;
    constructor(public el: ElementRef) {
        this.fecha = new EventEmitter();
    }
    ngOnInit(){
        let that = this;
        that.element = jQuery(this.el.nativeElement).datepicker({
            format: that.format.format,
            startView: that.format.startView,
            minViewMode: that.format.minViewMode,
            maxViewMode: that.format.maxViewMode,
            todayBtn: that.format.todayBtn,
            language: that.format.language,
            forceParse: that.format.forceParse,
            autoclose: that.format.autoclose,
            todayHighlight: that.format.todayHighlight,
            startDate:that.format.startDate,
            endDate:new Date(),
        });
        jQuery(this.el.nativeElement).datepicker().on('changeDate', function (ev) {
            if(that.format.return)
                that.fecha.emit({'date':moment.utc(ev.date).format(that.format.return),'key':ev.target.accessKey});
            else
                that.fecha.emit({'date':ev.date,'key':ev.target.accessKey});
        });
        jQuery('#formato').click(function (ev) {
            jQuery(that.el.nativeElement).datepicker({
                format: "yyyy",
            })

        })
    }
}