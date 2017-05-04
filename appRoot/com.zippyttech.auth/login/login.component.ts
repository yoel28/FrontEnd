import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {RestController} from '../../com.zippyttech.rest/restController';
import {contentHeaders} from '../../com.zippyttech.rest/headers';
import {AngularFire, AuthMethods, AuthProviders} from 'angularfire2';
import {AnimationsManager} from '../../com.zippyttech.ui/animations/AnimationsManager';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';

@Component({
    selector: 'user-login',
    styleUrls: ['./../style.css'],
    templateUrl: './index.html',
    animations: AnimationsManager.getTriggers('d-expand_down', 200)
})
export class LoginComponent extends RestController implements OnInit, OnDestroy {

    public submitForm: boolean = false;
    public context: any = {'company': null, 'public': {}};

    form: FormGroup;
    public subcribe;

    constructor(public af: AngularFire, public db: DependenciesBase, private routeActive: ActivatedRoute) {
        super(db);
        this.setEndpoint('/login/');
    }

    loginFirebase(token) {
        let that = this;
        let json = {};
        json['token'] = token;
        json['TokenFCM'] = '';
        let successCallback = response => {
            localStorage.setItem('bearer', response.json().tokenValue);
            contentHeaders.delete('Authorization');
            contentHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('bearer'));
            if (!that.context.company)
                localStorage.setItem('userTemp', 'true');
            let link = ['/init/load', {}];
            that.db.router.navigate(link);
        };
        if (this.context.company)
            return this.httputils.doPost(localStorage.getItem('url') + '/tokens/' + this.context.company + '/firebaseToken', JSON.stringify(json), successCallback, this.error, true);
        else
            return this.httputils.doPost(localStorage.getItem('url') + '/tokens/firebaseToken', JSON.stringify(json), successCallback, this.error, true)

    }

    ngOnInit() {
        this.initForm();
        this.context.company = this.routeActive.snapshot.params['company'];
        if (!this.context.company)
            this.context.company = 'zippyttech';
        if (this.context.company) {
            this.loadContextPublic();
            (<FormControl>this.form.controls['company']).setValue(this.context.company);
        }
    }

    loadContextPublic() {
        let that = this;
        let successCallback = response => {
            Object.assign(that.context.public, response.json());
            that.db.pathElements.logo = that.context.public.logo || that.db.pathElements.logo;
            that.db.pathElements.logoBlanco = that.context.public.logo || that.db.pathElements.logo;
            that.db.pathElements.isotipo = that.context.public.miniLogo || that.db.pathElements.isotipo;
        };
        this.httputils.doGet(localStorage.getItem('url') + '/context/' + this.context.company, successCallback, this.error, true);
    }

    initForm() {
        this.form = new FormGroup({
            username: new FormControl('', Validators.compose([Validators.required])),
            password: new FormControl('', Validators.compose([Validators.required])),
            company: new FormControl('', Validators.compose([Validators.required]))
        });
    }

    login(event: Event) {
        if (event)
            event.preventDefault();
        let that = this;
        let body = Object.assign({}, this.form.value);
        body['username'] = body['company'] + '/' + body['username'];
        this.submitForm = true;
        let errorLogin = (error: any) => {
            that.submitForm = false;
            that.error(error);
        };
        let successCallback = (response: any) => {
            that.submitForm = false;
            localStorage.setItem('bearer', response.json().access_token);
            contentHeaders.delete('Authorization');
            contentHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('bearer'));
            if (!this.context.company)
                localStorage.setItem('userTemp', 'true');
            let link = ['/init/load', {}];
            that.db.router.navigate(link);
        };
        this.httputils.doPost(this.endpoint, JSON.stringify(body), successCallback, errorLogin);
    }

    onRecover(event: Event) {
        if (event)
            event.preventDefault();

        let link = ['/auth/recover', {}];
        this.db.router.navigate(link);
    }

    ngOnDestroy() {
        if (this.subcribe)
            this.subcribe.unsubscribe();
        this.subcribe = null;
    }

    loginSocial(event: Event, social) {
        if (event)
            event.preventDefault();

        let auth;
        let that = this;
        if (this.subcribe)
            this.subcribe.unsubscribe();

        this.subcribe = this.af.auth.subscribe(
            (response: any) => {
                if (response && response.auth && !localStorage.getItem('bearer'))
                    that.loginFirebase(response.auth.kd);
            },
            error => {
                console.log(error.message);
            }
        );
        switch (social) {
            case 'fb':
                auth = AuthProviders.Facebook;
                break;
            case 'tw':
                auth = AuthProviders.Twitter;
                break;
            case 'go':
                auth = AuthProviders.Google;
                break;
        }
        this.af.auth.login({
            provider: auth,
            method: AuthMethods.Popup,
        });
    }
}