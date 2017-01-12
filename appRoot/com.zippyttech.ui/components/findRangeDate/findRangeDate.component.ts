import {Component, EventEmitter, OnInit, AfterViewInit, NgModule} from "@angular/core";
import {FormControl} from "@angular/forms";
import {SmDropdown} from "../../../com.zippyttech.utils/directive/smDropDown";
import {DateRangePicker} from "../../../com.zippyttech.utils/directive/dateRangePicker";
import {StaticValues} from "../../../com.zippyttech.utils/catalog/staticValues";
import {globalService} from "../../../com.zippyttech.utils/globalService";
import {StaticFunction} from "../../../com.zippyttech.utils/catalog/staticFunction";

declare var SystemJS:any;
@NgModule({
    imports:[SmDropdown,DateRangePicker]
})
@Component({
    selector: 'find-range-date-view',
    templateUrl: SystemJS.map.app+'/com.zippyttech.ui/components/findRangeDate/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.ui/components/findRangeDate/style.css'],
    inputs:['params','control'],
    outputs:['dateRange'],
})
export class FindRangeDateComponent implements OnInit,AfterViewInit {
    public control:FormControl;
    public params:any;
    public dateRange:any;

    public paramsDate = StaticValues.formatDateDDMMYYYY;
    public itemsDate = StaticValues.itemsDate;

    constructor(public myglobal:globalService) {
        this.control = new FormControl('');
        this.dateRange = new EventEmitter();
    }
    ngOnInit(){

    }
    ngAfterViewInit(){

    }
    setFecha(id){
        if(id!='-1'){
            this.control.setValue(StaticFunction.getDateRange(id));
            this.dateRange.emit(this.control);
        }
    }
    assignDate(value){
        this.control.setValue(value);
    }
}