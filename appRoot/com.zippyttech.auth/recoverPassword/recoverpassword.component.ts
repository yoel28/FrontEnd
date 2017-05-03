import {Component, OnInit} from '@angular/core';
import  {Validators, FormGroup,FormControl} from '@angular/forms';
import {RestController} from "../../com.zippyttech.rest/restController";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'user-recover-password',
    templateUrl: './index.html',
    styleUrls: [ './../style.css']
})
export class RecoverPasswordComponent extends RestController implements OnInit  {

    public form:FormGroup;
    public id:string;
    public token:string;


    constructor(public db:DependenciesBase,private routeActive:ActivatedRoute) {
        super(db);
    }
    ngOnInit():void{
        this.id=this.routeActive.snapshot.params['id'];
        this.token=this.routeActive.snapshot.params['token'];
        this.setEndpoint('/users/' + this.id + "?access_token=" + this.token);

        this.initForm();
    }
    initForm() {
        this.form = new FormGroup({
            password: new FormControl ("", Validators.compose([Validators.required]))
        });
    }
    recoverPassword(event){
        let that=this;
        event.preventDefault();

        let body = JSON.stringify({'password':this.form.value.password});
        let successCallback= response => {
            let link = ['/auth/login', {}];
            that.db.router.navigate(link);
        };
        this.httputils.doPut(this.endpoint,body,successCallback,this.error)
    }

    onLogin(event){
        event.preventDefault();
        let link = ['/auth/login', {}];
        this.db.router.navigate(link);
    }
}