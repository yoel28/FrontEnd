import {Component, EventEmitter, OnInit} from '@angular/core';
import {IModal, ModalViewComponent} from "../../com.zippyttech.ui/components/modalView/modalView.component";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {ModalService, IStatusModal} from "./modal.service";
declare var SystemJS:any;


var jQuery = require('jquery');

@Component({
    moduleId:module.id,
    selector: 'modal',
    templateUrl: 'template.html',
    inputs: ['sync','config']
})
export class ModalComponent implements OnInit{
    public config:IModal;
    public sync:boolean = true;
    private _visible:boolean = false;
    private modalView:ModalViewComponent;

    public constructor(public db:DependenciesBase,private ms:ModalService){}

    ngOnInit(){
        if(this.sync || !this.config)
            this.config = this.ms.configs['default'];
        if(this.sync)
            this.ms.onVisible.subscribe((value)=>{ this.visible = value; });
    }

    public set visible(value:boolean){
        if(value != this.visible) {
            this._visible = value;
            if (!value) this.ms.hideCurrentModal();
            else this.config = this.ms.configs[this.ms.currentModal] || this.ms.configs['default'];
            this.modalView.visible = value;
        }
    }
    public get visible():boolean{ return this._visible; }
}
