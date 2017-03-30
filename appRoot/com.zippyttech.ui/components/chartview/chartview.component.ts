import {Component} from "@angular/core";
import {ControllerBase} from "../../../com.zippyttech.common/ControllerBase";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {StaticFunction} from "../../../com.zippyttech.utils/catalog/staticFunction";


var moment = require('moment');
var jQuery = require('jquery');
const Highcharts = require('highcharts');
//const Highcharts3d = require('highcharts/highcharts-3d.src');
//Highcharts.setOptions({ colors: ['#058DC7', '#50B432', '#ED561B'] });

export interface IChartData
{
    endpoint:string;
    title:string;
    options:Highcharts.Options | {};
}

@Component({
    selector: 'chart-view',
    templateUrl: './template.html',
    styleUrls: ['./style.css'],
    inputs:['chartData']
})
export class ChartViewComponent extends ControllerBase
{

    public chartData:IChartData;
    public chartId:string;
    public selectDate:Date;
    public currentDate:Date;
    public viewDeep:number;

    constructor(public db:DependenciesBase){
        super(db);
        this.currentDate = new Date();
        this.selectDate = new Date();
        this.viewDeep = 0;
    }

    initModel() {
        this.chartId = StaticFunction.getRandomID("CHART");
        this.chartData.options["chart"].renderTo = this.chartId;
        this.chartData.options["credits"] = false;
        this.chartRefresh();
    }

    public onPointSelect(event)
    {
        if(this.validSelectPoint(event.context.x)) {
            this.db.myglobal.rest.findData = true;
            this.selectDate.setMonth(event.context.x);
            this.viewDeep++;
            this.chartRefresh();
        }
    }

    private validSelectPoint(month:number)
    {
        return this.viewDeep==0 && (
            (this.selectDate.getFullYear() < this.currentDate.getFullYear())?
                    true : (month <= this.currentDate.getMonth())
            );
    }

    private checkChange(dir:number):boolean{
        return dir==-1 || (
                (this.viewDeep == 0)?
                    (this.selectDate.getFullYear() < this.currentDate.getFullYear()) : (this.viewDeep == 1)?
                        (this.selectDate.getFullYear() < this.currentDate.getFullYear())?
                            true : (this.selectDate.getMonth() < this.currentDate.getMonth())
                :false
            );
    }

    public changeD(dir:number){
        if(this.checkChange(dir))
        {
            if(this.viewDeep == 0)
                this.selectDate.setFullYear(this.selectDate.getFullYear()+dir);

            if(this.viewDeep == 1){
                let month = this.selectDate.getMonth()+dir;
                if(month > 11){
                    this.selectDate.setMonth(0);
                    this.selectDate.setFullYear(this.selectDate.getFullYear()+dir);
                }
                else if(month < 0){
                    this.selectDate.setMonth(11);
                    this.selectDate.setFullYear(this.selectDate.getFullYear() + dir);
                }
                else this.selectDate.setMonth(month);
            }

            this.chartRefresh();
        }
    }

    public chartRefresh(){
        let callback = (response)=>{
            let data:any = {};
            Object.assign(data,response.json());
            for(let ob of data.list) {
                let newData = {
                    name: ob["name"],
                    data: ob["data"],
                    allowPointSelect: true
                };
                Object.assign(ob, newData);
            }
            this.chartData.options["title"] = { text: this.getTitle() },
            this.chartData.options["xAxis"]['categories'] = data.categories;
            this.chartData.options["series"] = data.list;
            this.db.myglobal.rest.findData = false;
        };
        this.db.myglobal.rest.findData = true;
        this.db.myglobal.httputils.doGet(this.chartData.endpoint+this.selectDate.getFullYear()+'/'+((this.viewDeep==0)?"":(this.selectDate.getMonth()+1)),callback,null,false);
    }

    public getTitle():string{
        let months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        if(this.viewDeep == 0)
            return ''+this.selectDate.getFullYear();
        return months[this.selectDate.getMonth()]+" de "+this.selectDate.getFullYear();
    }

}