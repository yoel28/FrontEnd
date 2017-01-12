import {ElementRef, Directive} from "@angular/core";

declare var jQuery:any;

@Directive({
    selector: "[sm-dropdown]"
})
export class SmDropdown {
    constructor(el: ElementRef) {
        jQuery(el.nativeElement).dropdown();
    }
}