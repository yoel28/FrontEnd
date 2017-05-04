import {StaticValues} from './staticValues';

let jQuery = require('jquery');
let moment = require('moment');
let Table2Excel = require('table2excel');
let humanizeDuration = require('humanize');

export class StaticFunction {
    public static dateHmanizer = StaticValues.dateHmanizer;

    //calcular rango de fechas dependiendo del id de itemsDate()
    public static getDateRange(itemDate: string): any {
        //Thu Jul 09 2015 00:00:00 GMT-0400 (VET)
        let day = moment().format('lll');
        let range: any = {'start': null, 'end': null};
        switch (itemDate) {
            case '1' : //hoy
                range.start = moment().format('DD-MM-YYYY');
                range.end = moment().add(1, 'day').format('DD-MM-YYYY');
                break;
            case '2' ://Semana Actual
                range.start = moment().startOf('week').format('DD-MM-YYYY');
                range.end = moment().endOf('week').add(1, 'day').format('DD-MM-YYYY');
                break;
            case '3' ://mes actual
                range.start = moment().startOf('month').format('DD-MM-YYYY');
                range.end = moment().add(1, 'month').startOf('month').format('DD-MM-YYYY');
                break;
            case '4' ://mes anterior
                range.start = moment().subtract(1, 'month').startOf('month').format('DD-MM-YYYY');
                range.end = moment().startOf('month').format('DD-MM-YYYY');
                break;
            case '5' ://ultimos 3 meses
                range.start = moment().subtract(3, 'month').startOf('month').format('DD-MM-YYYY');
                range.end = moment().add(1, 'month').startOf('month').format('DD-MM-YYYY');
                break;
            case '6' :// ano actual
                range.start = moment().startOf('year').format('DD-MM-YYYY');
                range.end = moment().endOf('year').add(1, 'day').format('DD-MM-YYYY');
                break;
        }
        return range;
    }

    //exportar a excel
    public static exportExcel(title: string, idClass?: string): any {
        let table2excel = new Table2Excel({
            'defaultFileName': title,
        });
        Table2Excel.extend((cell, cellText) => {
            if (cell) return {
                v: cellText,
                t: 's',
            };
            return null;
        });
        table2excel.export(document.querySelectorAll('table.' + ( idClass || 'export')));
    }

    // recibe un numerico en milisegundos
    public static formatTime(time: number) {
        if (time < 1800000)//menor a 30min
            return this.dateHmanizer(time, {units: ['m', 's']});
        if (time < 3600000) //menor a 1hora
            return this.dateHmanizer(time, {units: ['m']});
        return this.dateHmanizer(time, {units: ['h', 'm']});
    }

    public static classCol(lg = 12, md = 12, sm = 12, xs = 12) {
        let _lg = lg == 0 ? 'hidden-lg' : 'col-lg-' + lg;
        let _md = md == 0 ? 'hidden-md' : 'col-md-' + md;
        let _sm = sm == 0 ? 'hidden-sm' : 'col-sm-' + sm;
        let _xs = xs == 0 ? 'hidden-xs' : 'col-xs-' + xs;

        return ' ' + _lg + ' ' + _md + ' ' + _sm + ' ' + _xs;
    }

    public static classOffset(lg = 0, md = 0, sm = 0, xs = 0) {
        return ' col-lg-offset-' + lg + ' col-md-offset-' + md + ' col-sm-offset-' + sm + ' col-xs-offset-' + xs;
    }

    public static getRandomID(pref: string): string {
        return pref + '_' + Math.random().toString(36).substr(2, 9);
    }
}