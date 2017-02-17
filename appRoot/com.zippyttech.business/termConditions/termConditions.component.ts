import {Component, OnInit} from '@angular/core';
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

var jQuery = require('jquery');
@Component({
    moduleId:module.id,
    selector: 'term-conditions',
    templateUrl: 'index.html',
    styleUrls: [ 'style.css']
})
export class TermConditionsComponent implements OnInit{
    constructor(public db:DependenciesBase) {

    }
    ngOnInit(){
        if(!this.existToken()){
            let link = ['/auth/login', {}];
            jQuery('#termConditions').modal('show');
            this.db.router.navigate(link);
        }
    }

    existToken():boolean{
        return localStorage.getItem('bearer')?true:false;
    }
}


