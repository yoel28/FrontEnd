import {ElementRef, Directive,  OnInit} from "@angular/core";
import {ModelRoot} from "../../com.zippyttech.common/modelRoot";

export interface IParamsKnob{
    min?:number; //default=0.
    max?:number; //default=100.
    step?:number; //default=1.
    angleOffset?:number; //starting angle in degrees | default=0.
    angleArc?:number; //arc size in degrees | default=360.
    stopper?:boolean; // stop at min & max on keydown/mousewheel | default=true.
    readOnly?:boolean; //disable input and events | default=false.
    rotation?:'clockwise'; //direction of progression | default=clockwise.
    release?: (data)=>void;
    value?:number,
    fontWeight?:string
}


var jQuery = require('jquery');
var knob = require('knob');

@Directive({
    selector: "[knob]",
    inputs:['key','data','model','params'],
})
export class Knob implements OnInit{
    private key:string;
    private data:Object={};
    private model:ModelRoot;

    private params:IParamsKnob;


    constructor(public el: ElementRef) {

    }

    ngOnInit(){
        this.checkParams();
        jQuery(this.el.nativeElement).knob(this.params);

    }
    checkParams(){
        if(this.params){
            if(this.params.min == null)
                this.params.min = 0;
            if(this.params.max == null)
                this.params.max = 100;
            if(this.params.value == null)
                this.params.value = (this.data[this.key] || 0)

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