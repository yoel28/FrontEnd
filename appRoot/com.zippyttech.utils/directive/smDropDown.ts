import {ElementRef, Directive} from "@angular/core";

let jQuery = require('jquery');

@Directive({
    selector: "[sm-dropdown]"
})
export class SmDropdown {
    constructor(el: ElementRef) {
        jQuery(el.nativeElement).dropdown();
    }
}