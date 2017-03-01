import {ElementRef, Directive,  OnInit} from "@angular/core";
import {ModelRoot} from "../../com.zippyttech.common/modelRoot";

export interface IParamsInputMask{

}
var jQuery = require('jquery');
var mask = require('inputmask');
@Directive({
    selector: "[input-mask]",
    inputs:['data','rule','params'],
})
export class InputMask implements OnInit{
    private data:Object={};
    private rule:Object;
    private params:IParamsInputMask;

    private expMask={
        'email':[]
        //'email':[]
    };

    constructor(public el: ElementRef) {
        /*jQuery.inputmask.extendDefinitions({
            'f': {  //masksymbol
                "validator": "[0-9\(\)\.\+/ ]",
                "cardinality": 1,
                'prevalidator': null
            },
        })*/
    }

    ngOnInit(){
        this.checkParams();
        if(this.rule['type'] == 'email'){
            jQuery(this.el.nativeElement).inputmask("A{1,20}@B{1,20}.a{2,3}[.a{1,3}]",{
                definitions:{
                    'A':{validator:'[a-zA-Z0-9_.\-]'},
                    'B':{validator:'[a-zA-Z0-9\-]'},
                }
            });
        }
        if(this.rule['type'] == 'phone'){
            jQuery(this.el.nativeElement).inputmask("(99) 9999[9]-9999");
        }



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