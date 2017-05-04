import {Component} from '@angular/core';
import {BaseViewInstance} from '../com.zippyttech.ui/view/base/baseView.instance';
import {DependenciesBase} from './DependenciesBase';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'basic-component',
    templateUrl: './../com.zippyttech.ui/view/base/base.html',
    styleUrls: ['./../com.zippyttech.ui/view/base/style.css'],
    inputs: ['model', 'viewActions'],
    outputs: ['getInstance']
})
export class BasicComponent extends BaseViewInstance {

    constructor(public db: DependenciesBase, private route: ActivatedRoute) {
        super();
    }

    initModel() {
        let data: any = this.route.snapshot.data;
        if (data.model)
            this.model = new data.model(this.db);
    }

    initViewOptions(params) {
    }
}