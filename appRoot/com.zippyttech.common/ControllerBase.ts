import {StaticValues} from '../com.zippyttech.utils/catalog/staticValues';
import {OnInit} from '@angular/core';
import {StaticFunction} from '../com.zippyttech.utils/catalog/staticFunction';
import {DependenciesBase} from './DependenciesBase';
import {API} from '../com.zippyttech.utils/catalog/defaultAPI';
import {ModelRoot} from './modelRoot';
/**
 * @Params API
 * Optional
 *      {PREFIX}_DATE_MAX_HUMAN
 *
 *
 */

let jQuery = require('jquery');
let humanizeDuration = require('humanize');
let moment = require('moment');
let Table2Excel = require('table2excel');


export abstract class ControllerBase implements OnInit {

    public formatDateId: any = {};
    public configId = moment().valueOf();
    public viewOptions: any = {};
    public dateHmanizer = StaticValues.dateHmanizer;
    public model: ModelRoot;

    public classCol = StaticFunction.classCol;
    public classOffset = StaticFunction.classOffset;

    constructor(public db: DependenciesBase) {}

    ngOnInit(): void {
        this.initModel();
    }

    abstract initModel();

    public getViewOptionsButtons(type: string) {
        let visible = [];
        this.viewOptions['buttons'].forEach(obj => {
            if (obj.visible && obj.type == type)
                visible.push(obj);
        });
        return visible;
    }

    public getViewOptionsActions() {
        let visible = [];
        Object.keys(this.viewOptions.actions).forEach(obj => {
            if (this.viewOptions.actions[obj].visible)
                visible.push(obj);
        });
        return visible;
    }

    public getObjectKeys(data) {
        return Object.keys(data || {});
    }

    public formatDate(date, format, force = false, id = null) {
        if (date) {
            if (id && this.formatDateId[id])
                force = this.formatDateId[id].value;
            if (this.db.myglobal.getParams(this.model.prefix + '_DATE_FORMAT_HUMAN', API.DATE_FORMAT_HUMAN) && !force) {
                let diff = moment().valueOf() - moment(date).valueOf();
                if (diff < parseFloat(this.db.myglobal.getParams('DATE_MAX_HUMAN', API.DATE_MAX_HUMAN))) {
                    if (diff < 1800000)//menor a 30min
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m', 's']});
                    if (diff < 3600000) //menor a 1hora
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m']});
                    return 'Hace ' + this.dateHmanizer(diff, {units: ['h', 'm']});
                }
            }
            return moment(date).format(format);
        }
        return '-';
    }

    public changeFormatDate(id) {
        if (!this.formatDateId[id])
            this.formatDateId[id] = {'value': false};
        this.formatDateId[id].value = !this.formatDateId[id].value;
    }

    public viewChangeDate(date) {
        //<i *ngIf="viewChangeDate(data.rechargeReferenceDate)" class="fa fa-exchange" (click)="changeFormatDate(data.id)"></i>
        let diff = moment().valueOf() - moment(date).valueOf();
        return (
            (diff < this.db.myglobal.getParams('DATE_MAX_HUMAN', API.DATE_MAX_HUMAN)) &&
            this.db.myglobal.getParams(this.model.prefix + '_DATE_FORMAT_HUMAN', API.DATE_FORMAT_HUMAN)
        );
    }

    public modalIn: boolean = true;

    public loadPage(event?, accept = false) {
        if (event)
            event.preventDefault();
        if (this.model.permissions.warning || accept) {
            this.modalIn = false;
            if (this.model.permissions.list)
                return this.model.loadData().then(() => {
                    this.model.refreshList();
                });
        }
    }


    public onDashboard(event) {
        if (event)
            event.preventDefault();
        let link = ['init/dashboard', {}];
        this.db.router.navigate(link);
    }


    public exportXls() {
        let table2excel = new Table2Excel({
            'defaultFileName': this.configId,
        });
        Table2Excel.extend((cell, cellText) => {
            if (cell) return {
                v: cellText,
                t: 's',
            };
            return null;
        });
        table2excel.export(document.querySelectorAll('table.export'));
    }

    exportPrint() {
        let printContents = document.getElementById('reporte').innerHTML;
        let popupWin = window.open('', '_blank');
        popupWin.document.open();
        popupWin.document.write('<body onload="window.print()">' + printContents + '</body>');
        popupWin.document.head.innerHTML = (document.head.innerHTML);
        popupWin.document.close();
    }

    public get getFecha() {
        return moment().format('DD/MM/YYYY');
    }

    public get getHora() {
        return moment().format('LT');
    }

    public getKeysDataVisible() {
        let data = [];
        let that = this;
        Object.keys(this.model.rules).forEach((key) => {
            if (that.model.rules[key].visible)
                data.push(key)
        });
        return data;
    }

    public objectToString(data) {
        if (typeof data === 'object')
            return JSON.stringify(data);
        return '';
    }

}