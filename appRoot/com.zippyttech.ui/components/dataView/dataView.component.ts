import {Component, OnInit} from "@angular/core";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
declare var moment:any;

interface IDataView{
    internal?:boolean;
    cols?:{
        lg:1|2|3|4|6|12;
        md:1|2|3|4|6|12;
        sm:1|2|3|4|6|12;
        xs:1|2|3|4|6|12;
    };
    nav?:boolean | {
        dir:boolean;
        back:boolean;
    };
}


@Component({
    moduleId: module.id,
    selector: 'data-view',
    templateUrl: 'template.html',
    styleUrls: ['style.css'],
    inputs:['model','dataParams','paramsData']
})
export class DataViewComponent implements OnInit{
    private model:any;
    private paramsData:any;
    private dataParams:IDataView={ cols: {lg:4,md:3,sm:2,xs:1} };

    constructor(public db:DependenciesBase) { }

    ngOnInit(): void {
        if(!this.model)
            console.error("Model is required in DataViewComponent!");
    }

    private getDataKeys():string[]{
        let keys:string[]=[];
        if(this.model.dataList){
            try {
                Object.keys(this.model.rules).forEach((key) => {
                    if (this.model.rules[key].visible)
                        keys.push(key);
                });
            }
            catch(e){
                console.log(e);
            }
        }
       return keys;
    }
}