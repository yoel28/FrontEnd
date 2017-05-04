import {AfterContentInit, Directive, ElementRef} from '@angular/core';
declare let jQuery: any;
declare let Footable: any;

@Directive({
    selector: '[x-footable]'
})
export class XFootable implements AfterContentInit {

    constructor(private element: ElementRef) {
    }

    ngAfterContentInit(): void {
        jQuery(this.element.nativeElement).footable();
    }
}