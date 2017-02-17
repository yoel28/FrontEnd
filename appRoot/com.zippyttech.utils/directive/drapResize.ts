import {ElementRef, Directive} from "@angular/core";

var jQuery = require('jquery');

@Directive({
    selector: "[drap-resize]"
})
export class DrapResize {
    constructor(el: ElementRef) {
        jQuery(el.nativeElement).draggable().resizable();
    }
}