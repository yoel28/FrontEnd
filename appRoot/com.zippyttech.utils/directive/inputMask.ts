import {ElementRef, Directive,  OnInit} from "@angular/core";
import {ModelRoot} from "../../com.zippyttech.common/modelRoot";

export interface IParamsInputMask{

}
var jQuery = require('jquery');
@Directive({
    selector: "[input-mask]",
    inputs:['key','data','model','params'],
})
export class InputMask implements OnInit{
    private key:string;
    private data:Object={};
    private model:ModelRoot;
    private params:IParamsInputMask;


    constructor(public el: ElementRef) {

    }

    ngOnInit(){
        this.checkParams();
        jQuery(this.el.nativeElement).knob(this.params);

    }
    checkParams(){
        if(this.params){

        }
        else{
            this.params={
                min:0,
                max:100,
                readOnly:true,
                fontWeight:'900'
            }
        }
    }

}