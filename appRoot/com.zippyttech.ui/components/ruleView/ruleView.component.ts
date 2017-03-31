import {Component, EventEmitter, OnInit, AfterViewInit} from "@angular/core";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {ModelRoot} from "../../../com.zippyttech.common/modelRoot";
import {StaticValues} from "../../../com.zippyttech.utils/catalog/staticValues";
import {IModalParams, ModalName} from "../../../com.zippyttech.services/modal/modal.types";

/**
 * @Params API
 * Optional
 *      {MODEL_PREFIX}_DATE_FORMAT_HUMAN
 *      DATE_MAX_HUMAN
 *
 *
 */

export interface IRuleView{
    select:Object;//objecto que se selecciona
    searchParams:Object,//parametros del search del objecto que se selecciona
    searchInstances:Object,//instancias de todos los search
    viewListData:Object,//data de los multiples
    ruleReference:any,//regla para referencias
    arrayData:any[];
}

var moment = require('moment');
@Component({
    moduleId:module.id,
    selector: 'rule-view',
    templateUrl: 'index.html',
    styleUrls: [ 'style.css'],
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
    ngOnInit() {}

    private get currentRule(){
        return this.model.rules[this.key];
    }

    private get currentValue(){
        return this.data[this.key];
    }

    private get currentType(){
        let rule = this.currentRule;
        let type = rule.constructor.name.replace('Rule','').toLowerCase();
        return type;
    }

    public isCurrentType(list:Array<string>):boolean{
        return list.indexOf(this.currentType) >= 0 ? true:false;
    }

    public isCurrentMode(list:Array<string>):boolean{
        return list.indexOf(this.currentRule.mode) >= 0 ? true:false;
    }



    ngAfterViewInit() {
        this.getInstance.emit(this);
    }


    get getBooleandData(){

        let rule = this.currentRule;
        let value = this.currentValue;

        let field = {'class':'btn btn-orange','text':'n/a','disabled':true};

        if(!this.evalExp(this.data,(rule.disabled || 'false')))
        {
            let index = rule.source.findIndex(obj => (obj.value == value || obj.id == value));
            if(index > -1)
            {
                rule.source[index].disabled=!rule.update;
                return rule.source[index];
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
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m', 's']});
                    if (diff < 3600000) //menor a 1hora
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m']});
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

    get formatTimeView() {
        let value = this.currentValue;
        if (value) {
            if (value < 1800000)//menor a 30min
                return this.dateHmanizer(value, {units: ['m', 's']});
            if (value < 3600000) //menor a 1hora
                return this.dateHmanizer(value, {units: ['m']});
            if(value < 86400000)
                return  this.dateHmanizer(value, {units: ['h', 'm']});

            return  this.dateHmanizer(value)
        }
        return '-'

    }

    getDisabledField(data){
        return this.evalExp(data,(this.currentRule.disabled || 'false'));
    }

    setViewListData(event){
        let that=this;
        let rule = this.currentRule;
        let value = this.currentValue;

        if(event)
            event.preventDefault();
        this.paramsData.viewListData['title'] = rule.title;
        this.paramsData.viewListData['label']={};

        if(typeof value == 'object' && value.length>0)
        {
            Object.keys(value[0]).forEach(subkey=>{
                if(rule.rulesSave[subkey])
                    that.paramsData.viewListData['label'][subkey] = rule.rulesSave[subkey].title;
            });
        }
        this.paramsData.viewListData['data'] =  value;
        if(typeof value === 'string'){
            try{
                this.paramsData.viewListData['data'] = JSON.parse(value);
            }
            catch (exception){
                this.paramsData.viewListData['data'] = [];
                this.db.debugLog(['Error: setViewListData',exception]);
            }
        }
    }

    evalExp(data,exp){
        try{
            return eval(exp);
        }catch (exception){
            this.db.debugLog(['Error evalExp: ',exception,data])
        }
    }

    loadSaveModal(event) {
        if(event)
            event.preventDefault();
        this.paramsData.select=this.data;
    }

    loadSearchTable(event) {
        let rule = this.currentRule;
        let value = this.currentValue;

        if(event)
            event.preventDefault();
        this.checkAllSearch();
        this.paramsData.select=this.data;
        if(rule.multiple){//TODO:Falta completar el comportamiento
            rule.paramsSearch.multiple=true;
            rule.paramsSearch.valuesData=[];
            rule.paramsSearch.valuesData = value;
            if(rule.paramsSearch.eval)
                this.evalExp(this.data,rule.paramsSearch.eval);
        }
        this.paramsData.searchParams =  Object.assign({},rule.paramsSearch);
        this.paramsData.searchParams['field'] =  this.key;
    }

    loadDataFieldReference(setNull=false){
        let rule = this.currentRule;
        let value = this.currentValue;

        this.checkAllSearch();
        this.paramsData.ruleReference=Object.assign({},rule);
        this.paramsData.select = this.data;
        if(setNull)
            this.setDataFieldReference(true);

    }
    public setDataFieldReference(setNull=false) {
        let value=null;
        let that = this;

        if(!setNull)//no colocar valor nulo
        {
            value=this.paramsData.select['id'];
            if(that.paramsData.select[that.paramsData.ruleReference.code]!=null && that.paramsData.ruleReference.unique)
                that.paramsData.ruleReference.model.setDataField(that.paramsData.select[that.paramsData.ruleReference.code],that.model.ruleObject.key,null,that.paramsData.ruleReference.callback,that.paramsData.select).then(
                    response=>{
                        that.paramsData.ruleReference.model.setDataField(that.data.id,that.model.ruleObject.key,value,that.paramsData.ruleReference.callback,that.paramsData.select);
                    });
            else
                that.paramsData.ruleReference.model.setDataField(that.data.id,that.model.ruleObject.key,value,that.paramsData.ruleReference.callback,that.paramsData.select);
        }
        else
            that.paramsData.ruleReference.model.setDataField(this.data[that.paramsData.ruleReference.code],that.model.ruleObject.key,null,that.paramsData.ruleReference.callback,that.data);

    }

    private checkAllSearch() {
        let that=this;
        Object.keys(this.paramsData.searchInstances).forEach(key=>{
            if(that.paramsData.searchInstances[key] && that.paramsData.searchInstances[key].dataList){
                that.paramsData.searchInstances[key].dataList={}
            }
        })
    }

    get getTypeEval(){
        let rule = this.currentRule;
        return this.evalExp(this.data,this.currentRule.eval);
    }

    get getEnabled(){
        let rule= this.currentRule;
        let permitUpdate = (this.data.enabled && !this.data.deleted  && !this.data.blockField && this.data.editable);
        return permitUpdate && rule.permissions.update && !this.disabled;
    }
    // loadLocationParams(event) {
    //     if (event)
    //         event.preventDefault();
    //
    //     let rule = this.currentRule;
    //
    //     this.paramsData.select = this.data;
    //
    //     if (this.paramsData && this.paramsData.locationParams && this.paramsData.locationParams.instance) {
    //         this.paramsData.locationParams.center = {
    //             lat: parseFloat(this.data[rule.lat]),
    //             lng: parseFloat(this.data[rule.lng])
    //         };
    //         this.paramsData.locationParams.disabled = !this.getEnabled;
    //         this.paramsData.locationParams.instance.setMarker();
    //     }
    //     else {
    //         this.paramsData.locationParams = {
    //             disabled: !this.getEnabled,
    //             center: {
    //                 lat: parseFloat(this.data[rule.lat]),
    //                 lng: parseFloat(this.data[rule.lng])
    //             }
    //         }
    //     }
    //     this.paramsData.locationParams.keys = {
    //         lat: rule.lat,
    //         lng: rule.lng
    //     }
    //     this.paramsData.locationParams.address = this.getEnabled;
    // }TODO:IMPLEMENT

    showModal(name:ModalName,childKey?:any){
        let params: IModalParams = { model:this.model };
        switch (name){
            case 'save':
                params.extraParams = { childKey:childKey };
                break;

            case 'search':

                break;

            case 'delete':

                break;

            case 'location':

                break;

            default:
                alert('no implement '+name+' modal..');
                return;
        }
        this.db.ms.show(name,params);
    }
}

