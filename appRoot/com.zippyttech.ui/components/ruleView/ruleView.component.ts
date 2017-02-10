import {Component, EventEmitter, OnInit, AfterViewInit} from "@angular/core";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {ModelRoot} from "../../../com.zippyttech.common/modelRoot";
import {StaticValues} from "../../../com.zippyttech.utils/catalog/staticValues";
import {ILocation} from "../locationPicker/locationPicker.component";

export interface IRuleView{
    select:Object;//objecto que se selecciona
    searchParams:Object,//parametros del search del objecto que se selecciona
    searchInstances:Object,//instancias de todos los search
    viewListData:Object,//data de los multiples
    ruleReference:any,//regla para referencias
    locationParams:ILocation
}

declare var SystemJS:any;
declare var moment:any;

@Component({
    selector: 'rule-view',
    templateUrl: SystemJS.map.app+'/com.zippyttech.ui/components/ruleView/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.ui/components/ruleView/style.css'],
    inputs:['key','type','data','model','paramsData','disabled'],
    outputs:['getInstance'],
})
export class RuleViewComponent implements OnInit,AfterViewInit {

    public key: string;
    public disabled:boolean=false;
    public model: ModelRoot;
    public type:string = 'inline' || 'input';
    public data:any;

    public getInstance: any;
    public configId = moment().valueOf();

    public paramsData:IRuleView;

    constructor(public db: DependenciesBase) {
        this.getInstance = new EventEmitter();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.getInstance.emit(this);
    }

    getBooleandData(key,data){
        let field = {'class':'btn btn-orange','text':'n/a','disabled':true};

        if( (!eval(this.model.rules[key].disabled || 'false')))
        {
            let index = this.model.rules[key].source.findIndex(obj => (obj.value == data[key] || obj.id == data[key]));
            if(index > -1)
            {
                this.model.rules[key].source[index].disabled=!this.model.rules[key].update;
                return this.model.rules[key].source[index];
            }
        }
        return field;
    }

    public formatDateId={};
    public dateHmanizer = StaticValues.dateHmanizer;

    formatDate(date, format, force = false, id = null) {
        if (date) {
            if (id && this.formatDateId[id])
                force = this.formatDateId[id].value;
            if (this.db.myglobal.getParams(this.model.prefix + '_DATE_FORMAT_HUMAN') == 'true' && !force) {
                var diff = moment().valueOf() - moment(date).valueOf();
                if (diff < parseFloat(this.db.myglobal.getParams('DATE_MAX_HUMAN'))) {
                    if (diff < 1800000)//menor a 30min
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m', 's']})
                    if (diff < 3600000) //menor a 1hora
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m']})
                    return 'Hace ' + this.dateHmanizer(diff, {units: ['h', 'm']})
                }
            }
            return moment(date).format(format || 'DD/MM/YYYY');
        }
        return "-";
    }

    viewChangeDate(date) {
        //<i *ngIf="viewChangeDate(data.rechargeReferenceDate)" class="fa fa-exchange" (click)="changeFormatDate(data.id)"></i>
        var diff = moment().valueOf() - moment(date).valueOf();
        return ((diff < parseFloat(this.db.myglobal.getParams('DATE_MAX_HUMAN'))) && this.db.myglobal.getParams(this.model.prefix + '_DATE_FORMAT_HUMAN') == 'true')
    }

    changeFormatDate(id) {
        if (!this.formatDateId[id])
            this.formatDateId[id] = {'value': false};
        this.formatDateId[id].value = !this.formatDateId[id].value;
    }

    formatTimeView(data) {
        if (data) {
            if (data < 1800000)//menor a 30min
                return this.dateHmanizer(data, {units: ['m', 's']});
            if (data < 3600000) //menor a 1hora
                return this.dateHmanizer(data, {units: ['m']});
            if(data < 86400000)
                return  this.dateHmanizer(data, {units: ['h', 'm']});

            return  this.dateHmanizer(data)
        }
        return '-'

    }

    getDisabledField(key,data){
        return (eval(this.model.rules[key].disabled || 'false'));
    }

    setViewListData(event,data,key){
        let that=this;
        if(event)
            event.preventDefault();
        this.paramsData.viewListData['title'] = this.model.rules[key].title;
        this.paramsData.viewListData['label']={};
        if(typeof data[key] == 'object' && data[key].length>0)
        {
            Object.keys(data[key][0]).forEach(subkey=>{
                if(that.model.rules[key].rulesSave[subkey])
                    that.paramsData.viewListData['label'][subkey] = that.model.rules[key].rulesSave[subkey].title;
            });
        }
        this.paramsData.viewListData['data'] =  data[key];
        if(typeof data[key] === 'string'){
            try{
                this.paramsData.viewListData['data'] = JSON.parse(data[key])
            }
            catch (exception){
                console.log(exception);
            }
        }
    }

    evalExp(data,exp){
        try{
            return eval(exp);
        }catch (e){
            this.db.debugLog(e);
            this.db.debugLog('Verificar la regla en: ');
            this.db.debugLog(data);
            this.db.debugLog('-------------------------------------------------------------------------');
        }

    }

    loadSaveModal(event,key,data) {
        event.preventDefault();
        this.paramsData.select=data;
    }

    loadSearchTable(event,key,data) {
        if(event)
            event.preventDefault();
        this.checkAllSearch();
        this.paramsData.select=data;
        if(this.model.rules[key].multiple){//TODO:Falta completar el comportamiento
            this.model.rules[key].paramsSearch.multiple=true;
            this.model.rules[key].paramsSearch.valuesData=[];
            this.model.rules[key].paramsSearch.valuesData = data[key];
            if(this.model.rules[key].paramsSearch.eval)
                eval(this.model.rules[key].paramsSearch.eval);
        }
        this.paramsData.searchParams =  Object.assign({},this.model.rules[key].paramsSearch);
        this.paramsData.searchParams['field'] =  key;
    }

    loadDataFieldReference(data,key,setNull=false){
        this.checkAllSearch();
        this.paramsData.ruleReference=Object.assign({},this.model.rules[key]);
        this.paramsData.select = data;
        if(setNull)
            this.setDataFieldReference(data,true);

    }
    public setDataFieldReference(data,setNull=false) {
        let value=null;
        let that = this;

        if(!setNull)//no colocar valor nulo
        {
            value=this.paramsData.select['id'];
            if(that.paramsData.select[that.paramsData.ruleReference.code]!=null && that.paramsData.ruleReference.unique)
                that.paramsData.ruleReference.model.setDataField(that.paramsData.select[that.paramsData.ruleReference.code],that.model.ruleObject.key,null,that.paramsData.ruleReference.callback,that.paramsData.select).then(
                    response=>{
                        that.paramsData.ruleReference.model.setDataField(data.id,that.model.ruleObject.key,value,that.paramsData.ruleReference.callback,that.paramsData.select);
                    });
            else
                that.paramsData.ruleReference.model.setDataField(data.id,that.model.ruleObject.key,value,that.paramsData.ruleReference.callback,that.paramsData.select);
        }
        else
            that.paramsData.ruleReference.model.setDataField(data[that.paramsData.ruleReference.code],that.model.ruleObject.key,null,that.paramsData.ruleReference.callback,data);

    }

    private checkAllSearch() {
        let that=this;
        Object.keys(this.paramsData.searchInstances).forEach(key=>{
            if(that.paramsData.searchInstances[key] && that.paramsData.searchInstances[key].dataList){
                that.paramsData.searchInstances[key].dataList={}
            }
        })
    }

    public getTypeEval(key,data){
        if(this.model.rules[key])
            return eval(this.model.rules[key].eval);
    }

    getEnabled(){
        return (this.model.rules[this.key].update && this.data.enabled && !this.data.deleted && !this.disabled && !this.data.blockField && this.data.editable)
    }
    loadLocationParams(event,data){
        if(event)
            event.preventDefault();

        this.paramsData.select = data;

        if(this.paramsData && this.paramsData.locationParams && this.paramsData.locationParams.instance){
            this.paramsData.locationParams.center={
                lat:parseFloat(data[this.model.rules[this.key].lat]),
                lng:parseFloat(data[this.model.rules[this.key].lng])
            };
            this.paramsData.locationParams.disabled = !this.getEnabled();
            this.paramsData.locationParams.instance.setMarker();
        }
        else {
            this.paramsData.locationParams={
                disabled:!this.getEnabled(),
                center:{
                    lat:parseFloat(data[this.model.rules[this.key].lat]),
                    lng:parseFloat(data[this.model.rules[this.key].lng])
                }
            }
        }
        this.paramsData.locationParams.keys = {
            lat : this.model.rules[this.key].lat,
            lng : this.model.rules[this.key].lng
        }
        this.paramsData.locationParams.address = this.getEnabled();


    }


}

