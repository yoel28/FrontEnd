import {AfterViewInit, EventEmitter, OnInit} from '@angular/core';
import {BaseViewComponent} from './baseView.component';
import {ModelRoot} from '../../../com.zippyttech.common/modelRoot';

interface IViewOptions {
    viewActions?: boolean;
}

export abstract class BaseViewInstance implements OnInit, AfterViewInit {

    public viewActions: boolean = true;
    public viewOptions: IViewOptions = {};

    public getInstance: any;
    public instanceBase: BaseViewComponent;
    public instance: any = {};
    public model: ModelRoot;


    constructor() {
        this.getInstance = new EventEmitter();
    }

    abstract initModel();

    abstract initViewOptions(params: IViewOptions);

    ngOnInit() {
        this.initModel();
        this.initViewOptions(this.viewOptions);

        this._loadInstance();
    }

    ngAfterViewInit(): void {
        this.getInstance.emit(this);
    }

    protected _loadInstance() {
        this.viewOptions['viewActions'] = this.viewActions;

        this.instance = {
            'model': this.model,
            'viewOptions': this.viewOptions,
        };
    }

    public setInstance(instance: BaseViewComponent) {
        this.instanceBase = instance;
    }

}
