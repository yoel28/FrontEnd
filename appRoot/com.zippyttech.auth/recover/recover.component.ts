import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RestController} from '../../com.zippyttech.rest/restController';
import {AnimationsManager} from '../../com.zippyttech.ui/animations/AnimationsManager';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';

@Component({
    selector: 'user-recover',
    templateUrl: './index.html',
    styleUrls: ['./../style.css'],
    animations: AnimationsManager.getTriggers('d-expand_down', 200)
})
export class RecoverComponent extends RestController {

    form: FormGroup;

    constructor(public db: DependenciesBase) {
        super(db);
        this.setEndpoint(localStorage.getItem('url') + '/users/recover/');
        this.initForm();
    }

    initForm() {
        this.form = new FormGroup({
            username: new FormControl('', Validators.compose([Validators.required])),
        });
    }

    recoverPassword(event: Event) {
        event.preventDefault();
        let that = this;
        let successCallback = response => {
            let link = ['/auth/login', {}];
            that.db.router.navigate(link);
        }
        this.httputils.doGet(this.endpoint + this.form.value.username, successCallback, this.error, true);
    }

    onLogin(event: Event) {
        event.preventDefault();
        let link = ['/auth/login', {}];
        this.db.router.navigate(link);
    }
}