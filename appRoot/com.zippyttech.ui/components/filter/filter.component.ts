import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormGroup, FormControl} from "@angular/forms";
import {isNumeric} from "rxjs/util/isNumeric";
import {RestController} from "../../../com.zippyttech.rest/restController";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {ModelRoot} from "../../../com.zippyttech.common/modelRoot";
import {IRule} from "../../../com.zippyttech.common/rules/rule";
import {API} from "../../../com.zippyttech.utils/catalog/defaultAPI";

/*
 * @Params API
 * Optional
 *      WAIT_TIME_SEARCH
 *
*/

@Component({
    selector: 'filter-view',
    templateUrl: './index.html',
    styleUrls: [ './style.css'],
    inputs: ['model'],
    outputs: ['getInstance'],
})
export class FilterComponent extends RestController implements OnInit{

    private getInstance:any;
    private model:ModelRoot;
    private params:any={};
    private readonly code:string='filter';

    private filters = {
        '%ilike%':      {'text': 'Contiene(i)'},
        'eq':           {'text': 'Igual que'},
        'isNull':       {'text': 'Nulo'},
        'isNotNull':    {'text': 'No Nulo'},
        'ne':           {'text': 'Diferente que'},
        '%like%':       {'text': 'Contiene'},
        'like%':        {'text': 'Comienza con'},
        '%like':        {'text': 'Termina en'},
        'ilike%':       {'text': 'comienza con(i)'},
        '%ilike':       {'text': 'Termina en(i)'},
        'ge':           {'text': 'Mayor Igual'},
        'gt':           {'text': 'Mayor Que'},
        'le':           {'text': 'Menor Igual'},
        'lt':           {'text': 'Menor que'},
    };
    private filterType = {
        'text': this.getFilters(['%ilike%', 'eq', 'isNull', 'isNotNull', 'ne', '%like%', 'like%', '%like', 'ilike%', '%ilike'],'%ilike%'),
        'number': this.getFilters(['eq', 'isNotNull', 'isNull', 'ne', 'ge', 'gt', 'le', 'lt']),
        'time': this.getFilters(['eq', 'isNotNull', 'isNull', 'ne', 'ge', 'gt', 'le', 'lt']),
        'object': this.getFilters(['eq', 'isNotNull', 'isNull', 'ne']),
        'boolean': this.getFilters(['eq', 'isNotNull', 'isNull', 'ne']),
        'date': this.getFilters(['eq', 'isNotNull', 'isNull', 'ne']),
        'combodate': this.getFilters(['eq', 'isNotNull', 'isNull', 'ne']),
        'email': this.getFilters(['%ilike%', 'eq', 'isNull', 'isNotNull', 'ne', '%like%', 'like%', '%like', 'ilike%', '%ilike'],'%ilike%'),
        'select': this.getFilters(['eq', 'isNull', 'isNotNull', 'ne']),
        'textarea': this.getFilters(['%ilike%', 'eq', 'isNull', 'isNotNull', 'ne', '%like%', 'like%', '%like', 'ilike%', '%ilike'],'%ilike%'),
    };
    private getFilters(list: Array<string>,check = 'eq') {
        let data = [];
        list.forEach(key => {
            if(key == check)
                data.push({op:key,data:this.filters[key],check:true});
            else
                data.push({op:key,data:this.filters[key]});
        });
        return data;
    }



    //objecto del search actual
    public search:any={};
    //foormato de fecha
    public paramsDate={'format':"DD-MM-YYYY","minDate":"01-01-2016"};
    public date={};
    //Lista de id search
    public searchId:any={};
    public findControl:string="";//variable en el value del search
    //formulario generado
    form:FormGroup;
    control:any = {};
    keys:any = {};

    constructor(public db:DependenciesBase) {
        super(db);
        this.getInstance = new EventEmitter();
    }
    ngOnInit() {
        this.loadForm();
    }
    loadForm() {

        let that = this;
        let rule =  this.currentRule;

        Object.keys(rule).forEach((key)=> {

            if ((<IRule>rule[key]).permissions.search && (<IRule>rule[key]).include.filter) {

                that.newDataControl(key);

                if(rule[key].type == 'object')
                {
                    that.control[key].
                        valueChanges.
                        debounceTime(that.db.getParams('WAIT_TIME_SEARCH',API.WAIT_TIME_SEARCH)).
                        subscribe((value: string) => {
                            if(value && value.length > 0){
                                that.search=rule[key];
                                that.findControl = value;
                                that.setData({},true);
                                that.setEndpoint(rule[key].paramsSearch.endpoint+value);//TODO:Cambiar por modelRoot
                                if( !that.searchId[key]){
                                    that.loadData().then((response)=>{
                                        if(that.dataList && that.dataList.count == 1){
                                            that.getDataSearch(that.dataList.list[0])
                                        }
                                    });
                                }
                                else if(that.searchId[key].detail != value){
                                    that.loadData().then((response)=>{
                                        if(that.dataList && that.dataList.count==1){
                                            that.getDataSearch(that.dataList.list[0])
                                        }
                                    });
                                    delete that.searchId[key];
                                }
                                else{
                                    that.findControl="";
                                    that.search = [];
                                }
                            }else{
                                that.findControl="";
                                if(that.searchId[key])
                                    delete that.searchId[key];
                            }
                    });
                }
            }
        });
        this.form = new FormGroup(this.control);
        this.keys = Object.keys(this.control);
    }

    private get currentRule(){
        return this.model.rules;
    }

    private get currentParams(){
        return this.model.paramsSearch;
    }


    private newDataControl(key){

        this.control[key] = [];
        this.control[key] = new FormControl("");

        let cond = this.getCondition(this.currentRule[key]);
        this.control[key+'Cond'] = [];
        this.control[key+'Cond'] = new FormControl(cond[0].op);

    }

    private loadWhereFilter(where){
        this.model.loadWhere(where,null,'filter')
    }

    private getCondition(currentRule:any){
        let type = currentRule.type;

        if(currentRule.type == 'object'){
            if(currentRule.join){
                return this.filterType['text']
            }
            return this.filterType['object']
        }
        return this.filterType[type]
    }

    //Al hacer click en la lupa guarda los valores del objecto
    getLoadSearch(event,data){
        if(event)
            event.preventDefault();

        this.findControl="";
        this.dataList={};
        this.rest.max=5;
        this.search=data;
        this.getSearch();
    }
    //accion al dar click en el boton de buscar del formulario en el search
    getSearch(event?,value=''){
        if(event)
            event.preventDefault();
        this.setEndpoint(this.search.paramsSearch.endpoint+value);
        this.loadData();
    }
    //accion al dar click en el boton de cerrar el formulario
    searchQuit(event){
        event.preventDefault();
        this.search={};
        this.dataList={};
    }
    //accion al seleccion un parametro del search
    getDataSearch(data){
        this.searchId[this.search.key]={'id':data.id,'title':data.title,'detail':data.detail};
        (<FormControl>this.form.controls[this.search.key]).setValue(data.detail);
        this.dataList=[];
    }
    //Cargar data
    assignDate(data,key){
        this.control[key].setValue(data);
    }

    submitForm(event) {
        if(event)
            event.preventDefault();
        let _rules = this.currentRule;
        let dataWhere=[];
        let that=this;

        Object.keys(_rules).forEach( key=>{

            if(_rules[key].type=='boolean' && that.form.value[key]=='-1')
                that.form.controls[key].setValue(null);

            if(_rules[key].type=='select' && that.form.value[key]=='-1')
                that.form.controls[key].setValue(null);

            if(_rules[key].type=='filter' && that.form.value[key]=='-1')
                that.form.controls[key].setValue(null);

            if ((this.form.value[key] && this.form.value[key] != "") || that.form.value[key + 'Cond'] == 'isNull' || that.form.value[key + 'Cond'] == 'isNotNull')
            {
                let whereTemp:any = {};//Fila de where para un solo elemento

                whereTemp.code = that.code;
                whereTemp.op = that.form.value[key + 'Cond'];//condicion
                whereTemp.field = _rules[key].key || key;//columna


                if(_rules[key].type=='filter'){
                    whereTemp = _rules[key].where[that.form.value[key]];
                }

                if (_rules[key].subType)//si existe un subtype lo agregamos
                {
                    whereTemp.type = _rules[key].subType;
                }

                if (whereTemp.op != 'isNull' && whereTemp.op != 'isNotNull')// si es diferente de nulo, carge el value
                {
                    whereTemp.value = that.form.value[key];
                    that.getValue(whereTemp);
                    whereTemp = that.parseWhere(_rules[key],whereTemp);
                }

                dataWhere.push(whereTemp);
            }
        });
        if(this.params.where && this.params.where.length > 0 ){
            let temp = dataWhere.concat(this.params.where);
            dataWhere = temp;
        }
        this.loadWhereFilter(dataWhere);
    }
    private getValue(where){

        if (where.op.substr(0, 1) == "%")//inicia con
        {
            where.op = where.op.substr(1);
            where.value = "%" + where.value;
        }

        if (where.op.substr(-1) == "%")//termina en
        {
            where.op = where.op.slice(0, -1);
            where.value = where.value + "%";
        }
    }

    private getCurrentType(key){
        let _type = this.currentRule[key].type;
        switch(_type){
            case 'checklist':
                return 'text';
            default:
                return _type;
        }

    }

    private parseWhere(rule,where,value?):Object{

        let that = this;
        let _whereTemp:any={code:that.code};

        if ( (rule.type == 'number' || rule.type == 'time') && isNumeric(where.value)) {
            where.value = parseFloat(where.value);
            if (rule.double) {
                where.type = 'double';
            }
        }

        if (rule.type == 'date' || rule.type == 'combodate'){
            let _tmpValue = where.value;
            where.type='date';

            if (where.op == 'eq'){ // Si esta en rango..

                _whereTemp.and=[];

                where.value = _tmpValue.start;
                where.op = 'ge';

                _whereTemp.and.push(Object.assign({},where));

                where.value = _tmpValue.end;
                where.op='le';

                _whereTemp.and.push(Object.assign({},where));

                where =_whereTemp;
            }
            if (where.op == 'ne'){// para fechas fuera del rango

                _whereTemp.or=[];

                where.value = _tmpValue.start;
                where.op    =  'le';

                _whereTemp.or.push(Object.assign({},where));

                where.value = _tmpValue.end;
                where.op    =  'ge';

                _whereTemp.or.push(Object.assign({},where));

                where = _whereTemp;
            }
        }

        if(rule.type == 'boolean') {
            where.value = where.value=='true'?true:false;
        }

        if (rule.object) {

            if (this.searchId[rule.key] && this.searchId[rule.key].id) {
                where.value = this.searchId[rule.key].id;
                where.field = rule.paramsSearch.field;
            }
            else {
                if(!rule.join){
                    try {
                        where.value = parseFloat(where.value);
                    } catch (e) {
                        this.db.debugLog('Error: parseWhere ', e);
                    }
                }
            }
        }

        if(rule.join && typeof rule.join === 'object'){

            let test = {
                tracer: ['alias1', 'alias2'],
                conditions: [
                    {
                        rule: {
                            type: 'text',
                            double: true
                        },
                        where: {
                            field: 'name',
                        }
                    },
                    {
                        rule: {
                            type: 'text',
                        },
                        where: {
                            field: 'name',
                            op: 'ilike'
                        }
                    },
                    {
                        or: [
                            {
                                rule: {
                                    type: 'text',
                                    double: true
                                },
                                where: {
                                    field: 'name',
                                    op: 'ilike'
                                }
                            },
                            {
                                rule: {
                                    type: 'text',
                                    double: true
                                },
                                where: {
                                    field: 'name',
                                    op: 'ilike'
                                }
                            }
                        ]
                    }
                ]
            };

            let join:any = [];
            rule.join.conditions.forEach(obj=>{
                if(obj.and){
                    let join_and={and:[]};
                    obj.and.forEach(obj=>{
                        obj.where.value = where.value;
                        obj.where = that.parseWhere(obj.rule,obj.where);
                        join_and.and.push(obj.where);
                    });
                    let data = join.concat(join_and);
                    join = data;
                }
                if(obj.or){
                    let join_or={or:[]};
                    obj.or.forEach(obj=>{
                        obj.where.value = where.value;
                        obj.where = that.parseWhere(obj.rule,obj.where);
                        join_or.or.push(obj.where);
                    });
                    let data = join.concat(join_or);
                    join = data;
                }
                if(obj.rule && obj.where){
                    obj.where.value = where.value;
                    obj.where = that.parseWhere(obj.rule,obj.where);
                    let data = join.concat(obj.where);
                    join = data;
                }

            });
            (rule.join.tracer.reverse()).forEach(((alias,i)=>{
                if(!i){
                    where=Object.assign({},{code:this.code,'join':alias,'where':join});
                }
                else{
                    where={code:this.code,join:alias,where:[where]}
                }
            }).bind(this));
            rule.join.tracer.reverse();

        }

        return where;
    }



    //reset
    onReset(event) {
        event.preventDefault();
        this.date={};
        this.searchId={};
        this.keys.forEach(key=>{
            if(this.form.controls[key]){
                (<FormControl>this.form.controls[key]).setValue(null);
                (<FormControl>this.form.controls[key]).setErrors(null);
            }
        });
        let where=[];
        if(this.currentParams.where && this.currentParams.where.length > 0 ){
             where=this.currentParams.where;
        }
        this.loadWhereFilter(where);
    }
    //guardar condicion en el formulario
    setCondicion(cond,id){
        (<FormControl>this.form.controls[id+'Cond']).setValue(cond);
    }
    searchLength() {
        if(this.searchId)
            return Object.keys(this.searchId).length;
        return 0;
    }
    searchIdKeys(){
        return Object.keys(this.searchId);
    }
    setValueSelect(data,key){
        this.control[key].setValue(data);
        if(data=='-1')
            this.control[key].setValue(null);

    }

}

