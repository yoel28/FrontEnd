import {Component} from '@angular/core';
import {BaseViewInstance} from "../com.zippyttech.ui/view/base/baseView.instance";
import {DependenciesBase} from "./DependenciesBase";
import {ActivatedRoute} from "@angular/router";

declare var SystemJS:any;
@Component({
    selector: 'basic-component',
    templateUrl:SystemJS.map.app+'/com.zippyttech.ui/view/base/base.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/view/base/style.css'],
    inputs:['model','viewActions'],
    outputs:['getInstance']
})
export class BasicComponent extends BaseViewInstance{

    constructor(public db:DependenciesBase,private route: ActivatedRoute) {
        super();
    }
    initModel() {
        let data:any = this.route.snapshot.data;
        if(data.model)
            this.model= new data.model(this.db);
    }
    initViewOptions(params) {}
}