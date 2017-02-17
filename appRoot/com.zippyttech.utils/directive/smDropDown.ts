import {ElementRef, Directive} from "@angular/core";

var jQuery = require('jquery');

@Directive({
    selector: "[sm-dropdown]"
})
export class SmDropdown {
    constructor(el: ElementRef) {
        jQuery(el.nativeElement).dropdown();
    }
}