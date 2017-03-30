import {Component, OnInit} from '@angular/core';
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

@Component({
    selector: 'dashboard',
    templateUrl: './index.html',
    styleUrls: ['./style.css']
})
export class DashboardComponent implements OnInit{
    constructor(public db:DependenciesBase) {}

    ngOnInit():void{}

}


