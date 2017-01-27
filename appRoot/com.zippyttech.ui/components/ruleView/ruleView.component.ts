import {Component, EventEmitter, OnInit, AfterViewInit} from "@angular/core";
import {RestController} from "../../../com.zippyttech.rest/restController";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
declare var moment:any;

@Component({
    selector: 'rule-view',
    templateUrl: SystemJS.map.app+'/com.zippyttech.ui/components/ruleView/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.ui/components/ruleView/style.css'],
    inputs:['rule','type'],
    outputs:['getInstance'],
})
export class RuleViewComponent extends RestController implements OnInit,AfterViewInit {

    public rule: any = {};
    public type:string = 'inline' || 'input';

    public getInstance: any;
    public configId = moment().valueOf();

    constructor(public db: DependenciesBase) {
        super(db);
        this.getInstance = new EventEmitter();
    }

    ngOnInit() {
        this.type = '';
    }

    ngAfterViewInit() {
        this.getInstance.emit(this);
    }
}

