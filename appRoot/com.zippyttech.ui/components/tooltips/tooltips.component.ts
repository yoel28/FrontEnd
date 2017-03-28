import {Component, OnInit,HostListener} from '@angular/core';
import {InfoModel} from "../../../com.zippyttech.business/info/info.model";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";


var moment = require('moment');
var jQuery = require('jquery');

@Component({
    moduleId:module.id,
    selector: 'tooltip-view',
    templateUrl: 'index.html',
    styleUrls: [ 'style.css'],
    inputs: ['code'],
})
export class TooltipComponent implements OnInit{

    public permissions:any;
    public code="";
    public data:any={};
    public info:any;
    

    public configId=moment().valueOf();

    constructor(public db:DependenciesBase) {
        this.info=new InfoModel(db);
        this.permissions = Object.assign({},this.info.permissions);
    }
    ngOnInit() {
        this.configId='TOOLTIP_'+this.configId+'_'+this.code;
        if(this.code && this.code.length>0){
            this.data=this.db.myglobal.getTooltip(this.code);
        }
    }
    ngAfterViewInit()
    {
        let that=this;
        if(this.data && this.data.id){
            jQuery('#'+this.configId).popover({
                trigger: "manual"
            });
        }
    }
    edit(event,data){
        event.preventDefault();
        if(this.permissions.update){
            if(this.db.myglobal.objectInstance[this.info.prefix]){
                this.db.myglobal.objectInstance[this.info.prefix].setLoadDataModel(data,true);
            }
        }
    }
    @HostListener('document:click', ['$event.target'])
    public onClick(event) {
        let btn = jQuery(event).parents('#'+this.configId);
        if( (btn && btn.length > 0) || jQuery(event).attr('id') == this.configId ){
            jQuery('#'+this.configId).popover('show');
        }
        else{
            let exit= jQuery(event).parents('.popover');
            if(exit && exit.length == 0)
                jQuery('#'+this.configId).popover('destroy');
        }
    }
    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: any) {
        if(event.code == "Escape")
            jQuery("[data-toggle='popover']").popover('destroy');
    }
}
