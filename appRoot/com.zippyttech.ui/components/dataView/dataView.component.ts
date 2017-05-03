import {Component, OnInit} from "@angular/core";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {IRuleView} from "../ruleView/ruleView.component";

var moment = require('moment');

interface IDataView{
    internal?:boolean;
    cols?:{
        lg: 1|2|3|4|6|12;
        md: 1|2|3|4|6|12;
        sm: 1|2|3|4|6|12;
        xs: 1|2|3|4|6|12;
    };
    nav?:{
        dir:boolean;
        back:boolean;
    } | boolean;
    viewActions?:boolean;
    ruleViewOptions?:IRuleView;
}


@Component({
    selector: 'data-view',
    templateUrl: './template.html',
    styleUrls: ['./style.css'],
    inputs:['model','dataParams']
})
export class DataViewComponent implements OnInit{
    private model:any;
    private dataParams:IDataView={};

    private _data:any; //dataList
    private set data(dataList){ this._data = dataList;}
    private get data(){ return (this._data.list)?this._data.list[this.model.navIndex]:this._data;}

    constructor(public db:DependenciesBase){}

    ngOnInit(){
        if(!this.model) console.error("Model is required in DataViewComponent!");
        if(!this.dataParams.cols) this.dataParams.cols = {lg:4,md:3,sm:2,xs:1};
        this.data = this.model.dataList;
    }

    private getDataKeys():string[]{
        let keys:string[]=[];
        if(this.data)
            Object.keys(this.model.rules).forEach((key=>{
                if(this.model.rules[key].permissions.visible)
                    keys.push(key);
            }).bind(this));
        return keys;
    }

    public getNumber(value):number{
        return (value)?Number(value):0;
    }
}