import {StaticValues} from "./staticValues";
declare var moment:any;
declare var Table2Excel:any;
declare var humanizeDuration:any;

export class StaticFunction {
    public static dateHmanizer = StaticValues.dateHmanizer;

    //calcular rango de fechas dependiendo del id de itemsDate()
    public static getDateRange(itemDate:string):any
    {
        //Thu Jul 09 2015 00:00:00 GMT-0400 (VET)
        let day = moment().format('lll');
        let range:any={'start':null,'end':null};
        switch (itemDate)
        {
            case "1" : //hoy
                range.start = moment().format('DD-MM-YYYY');
                range.end   = moment().add(1,'day').format('DD-MM-YYYY');
                break;
            case "2" ://Semana Actual
                range.start = moment().startOf('week').format('DD-MM-YYYY');
                range.end   = moment().endOf('week').format('DD-MM-YYYY');
                break;
            case "3" ://mes actual
                range.start = moment().startOf('month').format('DD-MM-YYYY');
                range.end   = moment().endOf('month').format('DD-MM-YYYY');
                break;
            case "4" ://mes anterior
                range.start = moment().subtract(1, 'month').startOf('month').format('DD-MM-YYYY');
                range.end   = moment().subtract(1, 'month').endOf('month').format('DD-MM-YYYY');
                break;
            case "5" ://ultimos 3 meses
                range.start = moment().subtract(3, 'month').startOf('month').format('DD-MM-YYYY');
                range.end   = moment().endOf('month').format('DD-MM-YYYY');
                break;
            case "6" ://ano actual
                range.start = moment().startOf('year').format('DD-MM-YYYY');
                range.end   = moment().endOf('year').format('DD-MM-YYYY');
                break;
        }
        return range;
    }

    //exportar a excel
    public static exportExcel(title:string,idClass?:string):any
    {
        let table2excel = new Table2Excel({
            'defaultFileName': title,
        });
        Table2Excel.extend((cell, cellText) => {
            if (cell) return {
                v:cellText,
                t: 's',
            };
            return null;
        });
        table2excel.export(document.querySelectorAll("table."+ ( idClass || 'export')));
    }
    
    //recibe un numerico en milisegundos
    public static formatTime (time:number)
    {
        if (time < 1800000)//menor a 30min
            return  this.dateHmanizer(time, {units: ['m', 's']});
        if (time < 3600000) //menor a 1hora
            return this.dateHmanizer(time, {units: ['m']});
        return this.dateHmanizer(time, {units: ['h', 'm']});
    }

    public static classCol(lg=12,md=12,sm=12,xs=12){
        return ' col-lg-'+lg+' col-md-'+md+' col-sm-'+sm+' col-xs-'+xs;
    }
    public static classOffset(lg=0,md=0,sm=0,xs=0){
        return ' col-lg-offset-'+lg+' col-md-offset-'+md+' col-sm-offset-'+sm+' col-xs-offset-'+xs;
    }
}