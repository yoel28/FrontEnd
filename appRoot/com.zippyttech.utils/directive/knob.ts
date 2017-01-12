import {ElementRef, Directive, EventEmitter} from "@angular/core";

declare var jQuery:any;
@Directive({
    selector: "[knob]",
    outputs:['elem']
})
export class Knob {
    public elem:any;
    constructor(el: ElementRef) {
        let data = jQuery(el.nativeElement).knob();
        this.elem = new EventEmitter();
        this.elem.emit({data});
    }
}