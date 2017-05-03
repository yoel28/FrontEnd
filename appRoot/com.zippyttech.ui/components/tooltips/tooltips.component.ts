import {Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {InfoModel} from "../../../com.zippyttech.business/info/info.model";

let jQuery = require('jquery');

@Component({
    selector: 'tooltip-view',
    templateUrl: './index.html',
    styleUrls: [ './style.css'],
    inputs: ['code'],
})
export class TooltipComponent implements OnInit{
    @ViewChild('btn') btn:ElementRef;

    public permissions:any;
    public code="";
    public data:any={};
    public help:any;
    public $btn;
    private view:boolean = false;

    constructor(public db:DependenciesBase, public elem:ElementRef) {
        this.help=new InfoModel(db);
        this.permissions = Object.assign({},this.help.permissions);
    }
    ngOnInit() {
        if(this.code && this.code.length>0){
            this.data = this.db.myglobal.getTooltip(this.code);
        }
    }
    ngAfterViewInit()
    {
        if(this.data.id && this.btn) {
            this.$btn = jQuery(this.btn.nativeElement);
            this.$btn.popover({trigger: "manual"});
        }
    }
    edit(event,data){
        if(event)
            event.preventDefault();
        if(this.permissions.update){
            if(this.db.myglobal.objectInstance[this.help.prefix]){//TODO:Cambiar por el modalservice
                this.db.myglobal.objectInstance[this.help.prefix].setLoadDataModel(data,true);
            }
        }
    }

    @HostListener('click',['$event']) onClick(event) {
        if(this.data.id && this.view){
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    clickBtn(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        if(this.data.id){
            if(this.view)
                this.$btn.popover('destroy');
            else{
                this.$btn.popover('show');
                jQuery(window).one('click',(event)=>{
                    if(this.view)
                        this.clickBtn(event);
                });
            }
            this.view = !this.view;
        }

    }
}
