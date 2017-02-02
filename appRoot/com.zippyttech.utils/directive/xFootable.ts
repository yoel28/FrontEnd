import {
    ElementRef, Directive, Input, OnInit, AfterViewInit, AfterContentInit,
    AfterContentChecked
} from "@angular/core";
import {TablesComponent} from "../../com.zippyttech.ui/components/tables/tables.component";
declare let jQuery:any;
declare let Footable:any;

@Directive({
    selector: "[x-footable]"
})
export class XFootable implements AfterContentInit{

    constructor(private element: ElementRef){}

    ngAfterContentInit(): void{
        jQuery(this.element.nativeElement).footable();
    }
}