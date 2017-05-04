import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';
import {RestController} from '../../../com.zippyttech.rest/restController';
import {StaticValues} from '../../../com.zippyttech.utils/catalog/staticValues';
import {StaticFunction} from '../../../com.zippyttech.utils/catalog/staticFunction';
import {DependenciesBase} from '../../../com.zippyttech.common/DependenciesBase';
import {API} from '../../../com.zippyttech.utils/catalog/defaultAPI';

let moment = require('moment');

@Component({
    selector: 'accordion-view',
    templateUrl: './index.html',
    styleUrls: ['./style.css'],
    inputs: ['params', 'model', 'dataList', 'where'],
    outputs: ['getInstance'],
})


export class AccordionComponent extends RestController implements OnInit, AfterViewInit {


    public params: any = {};
    public model: any = {};
    public formatDateId: any = {};
    public dateHmanizer = StaticValues.dateHmanizer;

    public dataSelect: any = {};

    public keyActions = [];
    public configId = moment().valueOf();

    public getInstance: any;

    public formatTime = StaticFunction.formatTime;


    constructor(public db: DependenciesBase) {
        super(db);
        this.getInstance = new EventEmitter();
    }

    ngOnInit() {
        this.keyActions = Object.keys(this.params.actions || {});
        this.setEndpoint(this.model.endpoint);
        this.setEndpoint(this.params.endpoint);
    }

    ngAfterViewInit() {
        this.getInstance.emit(this);
    }

    actionPermissionKey() {
        let data = [];
        let that = this;
        Object.keys(this.params.actions || {}).forEach((key) => {
            if (that.params.actions[key].permission || false) {
                data.push(key);
            }
        });
        return data;
    }

    public formatDate(date, format, force = false, id = null) {
        if (date) {
            if (id && this.formatDateId[id]) {
                force = this.formatDateId[id].value;
            }
            if (!force) {
                let diff = moment().valueOf() - moment(date).valueOf();
                if (diff < parseFloat(this.db.myglobal.getParams('DATE_MAX_HUMAN', API.DATE_MAX_HUMAN))) {
                    return 'Hace ' + this.formatTime(diff);
                }
            }
            return moment(date).format(format);
        }
        return '-';
    }

    public changeFormatDate(id) {
        if (!this.formatDateId[id]) {
            this.formatDateId[id] = {'value': false};
        }
        this.formatDateId[id].value = !this.formatDateId[id].value;
    }

    public viewChangeDate(date) {
        let diff = moment().valueOf() - moment(date).valueOf();
        return ((diff < parseFloat(this.db.myglobal.getParams('DATE_MAX_HUMAN', API.DATE_MAX_HUMAN))))
    }

    public getObjectKey(data) {
        return Object.keys(data);
    }

}
