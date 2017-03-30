import {Component, OnInit, OnDestroy} from '@angular/core';
import {globalService} from "../../com.zippyttech.utils/globalService";
import {Router} from "@angular/router";


@Component({
    selector: 'load-page',
    templateUrl: './index.html',
    styleUrls: [ './style.css']
})
export class LoadComponent implements OnInit,OnDestroy{

    public subscribe:any;

    constructor(public router: Router,public myglobal:globalService) {}
    ngOnInit():void{
        let that=this;
        this.subscribe = this.myglobal.dataSesion.valueChanges.subscribe(
            (value:string) => {
                that.onLoadPage();
            }
        );
        if(localStorage.getItem('bearer')){
            if(this.myglobal.dataSesion.valid)
                this.onLoadPage();
            else
                this.myglobal.initSession();
        }
    }
    public onLoadPage(){
        if(this.myglobal.dataSesion.valid)
        {
            if(!this.myglobal.saveUrl || (this.myglobal.saveUrl && this.myglobal.saveUrl=='/'))
                this.myglobal.saveUrl='/init/dashboard';
            let link = [ this.myglobal.saveUrl, {}];
            this.myglobal.saveUrl=null;
            this.router.navigate(link);
        }
    }
    ngOnDestroy():void {
        this.subscribe.unsubscribe();
    }

}


