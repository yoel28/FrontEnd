import {Component, OnInit} from '@angular/core';
import {RestController} from "../../com.zippyttech.rest/restController";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {ActivatedRoute} from "@angular/router";


declare var SystemJS:any;
@Component({
    selector: 'user-activate',
    templateUrl: SystemJS.map.app+'/com.zippyttech.auth/activate/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.auth/style.css']
})
export class ActivateComponent extends RestController implements OnInit{
    public activate={'status':false,'response':false};
    public id:string;
    public token:string;

    constructor(public db:DependenciesBase,private routeActive:ActivatedRoute) {
        super(db);
    }
    ngOnInit():void{
        this.id=this.routeActive.snapshot.params['id'];
        this.token=this.routeActive.snapshot.params['token'];
        this.setEndpoint('/users/activate/' + this.id + "?access_token=" + this.token);
        this.validate();
    }
    validate() {
        let that=this;
        let successCallback = response => {
            that.activate.response=true;
            that.activate.status = true;
        }
        let errorCallback = err => {
            that.activate.response=true;
        }
        this.httputils.doGet(this.endpoint, successCallback, errorCallback)
    }
    onLogin(event){
        event.preventDefault();
        let link = ['/auth/login', {}];
        this.db.router.navigate(link);
    }
}
