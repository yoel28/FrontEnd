import {ElementRef, Directive,  OnInit} from "@angular/core";
import {ModelRoot} from "../../com.zippyttech.common/modelRoot";
import {FormControl} from "@angular/forms";

export interface IParamsInputMask{

}
var jQuery = require('jquery');
var mask = require('inputmask');
var bootstrap = require('bootstrap');

@Directive({
    selector: "[input-mask]",
    inputs:['control','rule','params'],
})
export class InputMask implements OnInit{
    private control:FormControl;
    private rule:Object;
    private params:IParamsInputMask;

    private expMask={
        'email':[]
        //'email':[]
    };

    constructor(public el: ElementRef) {
        this.control = new FormControl();
    }

    ngOnInit(){
        this.checkParams();
        if(this.rule['type'] == 'email'){
            jQuery(this.el.nativeElement).inputmask("A{1,20}@B{1,20}.a{2,3}[.a{1,3}]",{
                definitions:{
                    'A':{validator:'[a-zA-Z0-9_.\-]'},
                    'B':{validator:'[a-zA-Z0-9\-]'},
                },
                oncomplete: ((event)=>{
                    let value = event.target.value;
                    if(value){
                        this.control.setValue(value)
                    }
                }).bind(this),
                onincomplete: ((event)=>{
                    this.control.setValue(null)
                }).bind(this)

            });
        }
        if(this.rule['type'] == 'phone'){
            jQuery(this.el.nativeElement).inputmask("(99) 9999[9]-9999");
        }
        if(this.rule['type'] == 'date'){
            jQuery(this.el.nativeElement).inputmask('dd-mm-yyyy',{
                oncomplete: ((event)=>{
                    let value = event.target.value;
                    if(value){
                        this.control.setValue(value)
                    }
                }).bind(this),
                onincomplete: ((event)=>{
                    this.control.setValue(null)
                }).bind(this)

            });
        }
        if(this.rule['type'] == 'datetime'){
            jQuery(this.el.nativeElement).inputmask('dd-mm-yyyy hh:mm:ss',
                {
                    oncomplete: ((event)=>{
                        let value = event.target.value;
                        if(value){
                            this.control.setValue(value)
                        }
                    }).bind(this),
                    onincomplete: ((event)=>{
                        this.control.setValue(null)
                    }).bind(this)

                }
            );
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