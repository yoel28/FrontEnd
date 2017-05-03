import {ElementRef, Directive} from "@angular/core";

let jQuery = require('jquery');

@Directive({
    selector: "[drap-resize]"
})
export class DrapResize {
    constructor(el: ElementRef) {
        jQuery(el.nativeElement).draggable().resizable();
    }
}