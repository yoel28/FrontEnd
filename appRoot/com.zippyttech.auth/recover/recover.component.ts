import {Component} from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import {RestController} from "../../com.zippyttech.rest/restController";
import {StaticValues} from "../../com.zippyttech.utils/catalog/staticValues";
import {AnimationsManager} from "../../com.zippyttech.ui/animations/AnimationsManager";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
@Component({
    selector: 'user-recover',
    templateUrl: SystemJS.map.app+'com.zippyttech.auth/recover/index.html',
    styleUrls: [ SystemJS.map.app+'com.zippyttech.auth/style.css'],
    animations: AnimationsManager.getTriggers("d-expand_down",200)
})
export class RecoverComponent extends RestController {
    
    form:FormGroup;

    constructor(public db:DependenciesBase) {
        super(db);
        this.setEndpoint(localStorage.getItem('url')+'/users/recover/');
        this.initForm();
    }
    initForm() {
        this.form = new FormGroup({
            username:new FormControl ("", Validators.compose([Validators.required])),
        });
    }
    recoverPassword(event:Event){
        event.preventDefault();
        let that= this;
        let successCallback= response => {
            let link = ['/auth/login', {}];
            that.db.router.navigate(link);
        }
        this.httputils.doGet(this.endpoint+this.form.value.username,successCallback,this.error,true);
    }
    onLogin(event:Event){
        event.preventDefault();
        let link = ['/auth/login', {}];
        this.db.router.navigate(link);
    }
}