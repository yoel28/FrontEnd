import {Component, EventEmitter, ElementRef, DoCheck} from '@angular/core';
import {RestController} from "../../../com.zippyttech.rest/restController";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
var jQuery = require('jquery');

export interface IModal{
    id:string;
    global?:{
        size?:'modal-sm' | 'modal-md' | 'modal-lg';
    };
    header?:{
        title:string;
        class?:string;
    };
    body?:{
        //TODO: define body params
    };
    footer?:Array<{
        title:string;
        icon?:string;
        class?:string;
        callback():void;
    }>;
}
@Component({
    moduleId:module.id,
    selector: 'modal-view',
    templateUrl: 'index.html',
    styleUrls: [ 'style.css'],
    inputs:['params'],
    outputs:['getInstance','onVisible'],
})
export class ModalViewComponent extends RestController implements DoCheck{

    public params:IModal;
    private _visible:boolean;

    public getInstance:EventEmitter<ModalViewComponent>;
    public onVisible:EventEmitter<boolean>;

    constructor(public db:DependenciesBase) {
        super(db);
        this._visible = false;
        this.getInstance = new EventEmitter<ModalViewComponent>(true);
        this.onVisible = new EventEmitter<boolean>(true);
    }

    ngOnInit(){
        this.getInstance.emit(this);
    }

    ngDoCheck(){
        jQuery('#'+this.params.id).on('shown.bs.modal hidden.bs.modal',((e)=>{
            e.stopImmediatePropagation();
            this._visible = (e.type == "shown");
            console.log('jQueryMethod launch as ' + e.type);
            this.onVisible.emit(this._visible);
        }).bind(this));
    }


    public set visible(value:boolean){
        if(value ==  this._visible) return;
        jQuery('#'+this.params.id).modal((value)?'show':'hide');
    }

    public get visible(){
        return this._visible;
    }


}

