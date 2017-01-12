import {ElementRef, Directive, Input} from "@angular/core";
declare let jQuery:any;
@Directive({
    selector: "[x-footable]"
})
export class XFootable{
    private _active:boolean;

    @Input('x-footable')
    set active(value:boolean) {
        this._active = value;
        console.log("FOOTABLE:"+((this._active)?"TRUE":"FALSE"));
        if(this._active)
            this.run();
    }

    constructor(private el: ElementRef){
        this.active = false;
    }

    private run()
    {
        //jQuery(this.el.nativeElement).footable();
    }
}