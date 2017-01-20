import {Component} from '@angular/core';
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

@Component({
    moduleId:module.id,
    selector: 'term-conditions',
    templateUrl: 'index.html',
    styleUrls: [ 'style.css']
})
export class TermConditionsComponent{
    constructor(public db:DependenciesBase) {}
}


