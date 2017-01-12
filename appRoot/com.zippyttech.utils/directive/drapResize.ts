import {ElementRef, Directive} from "@angular/core";

declare var jQuery:any;

@Directive({
    selector: "[drap-resize]"
})
export class DrapResize {
    constructor(el: ElementRef) {
        jQuery(el.nativeElement).draggable().resizable();
    }
}