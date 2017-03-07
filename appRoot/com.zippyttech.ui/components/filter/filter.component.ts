import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormGroup, FormControl} from "@angular/forms";
import {isNumeric} from "rxjs/util/isNumeric";
import {RestController} from "../../../com.zippyttech.rest/restController";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;
@Component({
    selector: 'filter-view',
    templateUrl: SystemJS.map.app+'/com.zippyttech.ui/components/filter/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.ui/components/filter/style.css'],
    inputs: ['rules', 'params'],
    outputs: ['whereFilter'],
})
export class FilterComponent extends RestController implements OnInit{

    //objeto con las reglas de modelo
    public rules:any = {};
    //parametro de salida
    public whereFilter:any;
    //Parametros para visualizar el modal
    public params:any = {
        title: "sin titulo",
        idModal: "nomodal",
        endpoint: "sin endpoint",
        placeholder: "sin placeholder",
        where:[]
    };
    //objecto del search actual
    public search:any={};
    //lista de operadores condicionales
    public  cond = {
        'text': [
            {'id':'%ilike%','text': 'Contiene(i)'},
            {'id':'eq','text':'Igual que'},
            {'id':'isNull','text':'Nulo'},
            {'id':'isNotNull','text':'No nulo'},
            {'id':'ne','text':'Diferente que'},
            {'id':'%like%','text': 'Contiene'},
            {'id':'like%','text': 'Comienza con'},
            {'id':'%like','text': 'Termina en'},
            {'id':'ilike%','text': 'Comienza con(i)'},
            {'id':'%ilike','text': 'Termina en(i)'}

        ],
        'number':[
            {'id':'eq','text':'Igual que'},
            {'id':'isNotNull','text':'No nulo'},
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
            {'id':'ge','text':'Mayor Igual'},
            {'id':'gt','text':'Mayor que'},
            {'id':'le','text':'Menor Igual'},
            {'id':'lt','text':'Menor que'},
        ],
        'time':[
            {'id':'eq','text':'Igual que'},
            {'id':'isNotNull','text':'No nulo'},
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
            {'id':'ge','text':'Mayor Igual'},
            {'id':'gt','text':'Mayor que'},
            {'id':'le','text':'Menor Igual'},
            {'id':'lt','text':'Menor que'},
        ],
        'object':[
            {'id':'eq','text':'Igual que'},
            {'id':'isNotNull','text':'No nulo'},
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
        ],
        'boolean':[
            {'id':'eq','text':'Igual que'},
            {'id':'isNotNull','text':'No nulo'},
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
        ],
        'date':[
            {'id':'eq','text':'En rango'},
            {'id':'isNotNull','text':'No nulo'},
            {'id':'ne','text':'Fuera de rango'},
            {'id':'isNull','text':'Nulo'},
        ],
        'combodate':[
            {'id':'eq','text':'En rango'},
            {'id':'isNotNull','text':'No nulo'},
            {'id':'ne','text':'Fuera de rango'},
            {'id':'isNull','text':'Nulo'},
        ],
        'email': [
            {'id':'%ilike%','text': 'Contiene(i)'},
            {'id':'eq','text':'Igual que'},
            {'id':'isNotNull','text':'No nulo'},
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
            {'id':'%like%','text': 'Contiene'},
            {'id':'like%','text': 'Comienza con'},
            {'id':'%like','text': 'Termina en'},
            {'id':'ilike%','text': 'Comienza con(i)'},
            {'id':'%ilike','text': 'Termina en(i)'}
        ],
        'select': [
            {'id':'eq','text':'Igual que'},
            {'id':'isNotNull','text':'No nulo'},
            {'id':'ne','text':'Diferente que'},
            {'id':'isNull','text':'Nulo'},
        ],
        'textarea': [
            {'id':'%ilike%','text': 'Contiene(i)'},
            {'id':'eq','text':'Igual que'},
            {'id':'isNotNull','text':'No nulo'},
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
            {'id':'%like%','text': 'Contiene'},
            {'id':'like%','text': 'Comienza con'},
            {'id':'%like','text': 'Termina en'},
            {'id':'ilike%','text': 'Comienza con(i)'},
            {'id':'%ilike','text': 'Termina en(i)'}
        ],
    };
    //foormato de fecha
    public paramsDate={'format':"DD-MM-YYYY","minDate":"01-01-2016"};
    public date={};
    //Lista de id search
    public searchId:any={};
    public findControl:string="";//variable en el value del search
    //formulario generado
    form:FormGroup;
    data:any = {};
    keys:any = {};

    constructor(public db:DependenciesBase) {
        super(db);
        this.whereFilter = new EventEmitter();
    }
    ngOnInit() {
        this.loadForm();
    }
    loadForm() {
        let that = this;
        Object.keys(this.rules).forEach((key)=> {
            if (that.rules[key].search) {
                that.data[key] = [];
                that.data[key] = new FormControl("");

                that.data[key+'Cond'] = [];

                let cond = this.cond[this.rules[key].object?'object':this.rules[key].type];
                that.data[key+'Cond'] = new FormControl(cond?cond[0].id:'eq');


                if(that.rules[key].object)
                {
                    that.data[key].
                        valueChanges.
                        debounceTime(this.db.myglobal.getParams('WAIT_TIME_SEARCH') || '500').
                        subscribe((value: string) => {
                            if(value && value.length > 0){
                                that.search=that.rules[key];
                                that.findControl = value;
                                that.dataList=[];
                                that.setEndpoint(that.rules[key].paramsSearch.endpoint+value);
                                if( !that.searchId[key]){
                                    that.loadData().then(((response)=>{
                                        if(this.dataList && this.dataList.count == 1){
                                            this.getDataSearch(this.dataList.list[0])
                                        }
                                    }).bind(this));
                                }
                                else if(that.searchId[key].detail != value){
                                    that.loadData().then(((response)=>{
                                        if(this.dataList && this.dataList.count==1){
                                            this.getDataSearch(this.dataList.list[0])
                                        }
                                    }).bind(this));
                                    delete that.searchId[key];
                                }
                                else{
                                    this.findControl="";
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

        this.form = new FormGroup(this.data);
        this.keys = Object.keys(this.rules);
    }

    //Al hacer click en la lupa guarda los valores del objecto
    getLoadSearch(event,data){
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
        this.data[key].setValue(data);
    }
    
    // public search=
    //
    //     {
    //         title:"Vehiculo",
    //         idModal:"searchVehicle",
    //         endpoint:"/search/vehicles/",
    //         placeholder:"Ingrese la placa del vehiculo",
    //         label:{'name':"Placa: ",'detail':"Empresa: "},
    //         where:"&where="+encodeURI("[['op':'isNull','field':'tag.id']]")
    //     }
    
    
    submitForm(event) {
        event.preventDefault();
        let dataWhere=[];
        let that=this;
        Object.keys(this.rules).forEach( key=>{
            if(that.rules[key].type=='boolean' && that.form.value[key]=='-1')
                that.form.controls[key].setValue(null);
            if(that.rules[key].type=='select' && that.form.value[key]=='-1')
                that.form.controls[key].setValue(null);
            if(that.rules[key].type=='filter' && that.form.value[key]=='-1')
                that.form.controls[key].setValue(null);

            if ((this.form.value[key] && this.form.value[key] != "") || that.form.value[key + 'Cond'] == 'isNull' || that.form.value[key + 'Cond'] == 'isNotNull')
            {
                let whereTemp:any = {};//Fila de where para un solo elemento
                let whereTemp2:any;//Fila para codificiones multiples

                whereTemp.op = that.form.value[key + 'Cond'];//condicion
                whereTemp.field = that.rules[key].key || key;//columna

                if(that.rules[key].type=='filter'){
                    whereTemp = that.rules[key].where[this.form.value[key]];
                }


                if (that.rules[key].subType)//si existe un subtype lo agregamos
                {
                    whereTemp.type = that.rules[key].subType;
                }

                if (whereTemp.op != 'isNull' && whereTemp.op != 'isNotNull')// si es diferente de nulo, carge el value
                {
                    whereTemp.value = that.form.value[key];//valor

                    if (whereTemp.op.substr(0, 1) == "%")//inicia con
                    {
                        whereTemp.op = whereTemp.op.substr(1);
                        whereTemp.value = "%" + whereTemp.value;
                    }

                    if (whereTemp.op.substr(-1) == "%")//termina en
                    {
                        whereTemp.op = whereTemp.op.slice(0, -1);
                        whereTemp.value = whereTemp.value + "%";
                    }

                    if ( (that.rules[key].type == 'number' || that.rules[key].type == 'time') && isNumeric(whereTemp.value))// tipo numerico...
                    {
                        whereTemp.value = parseFloat(whereTemp.value);
                        if (that.rules[key].double)
                        {
                            whereTemp.type = 'double';
                        }
                    }

                    if (that.rules[key].type == 'date')//si es tipo date..
                    {
                        whereTemp.type='date';

                        whereTemp2={};
                        if (this.data[key + 'Cond'].value == 'eq') // Si esta en rango..
                        {
                            whereTemp.value = that.form.value[key].start;
                            whereTemp.op = 'ge';

                            whereTemp2.value = that.form.value[key].end;
                            whereTemp2.op='le';

                            whereTemp2.field = whereTemp.field;
                            whereTemp2.type = whereTemp.type;
                        }
                        if (this.data[key + 'Cond'].value == 'ne')// para fechas fuera del rango
                        {
                            whereTemp2.or=[];

                            whereTemp.value = that.form.value[key].start;
                            whereTemp.op    =  'le';

                            whereTemp2.or.push(Object.assign({},whereTemp));

                            whereTemp.value = that.form.value[key].end;
                            whereTemp.op    =  'ge';

                            whereTemp2.or.push(Object.assign({},whereTemp));

                            whereTemp = Object.assign({},whereTemp2);

                            whereTemp2=null;
                        }
                    }

                    if (that.rules[key].object) // si es un objecto y existe el id
                    {
                        if(that.searchId[key] && that.searchId[key].id){
                            whereTemp.value = that.searchId[key].id;
                        }
                        else
                        {
                            try {
                                whereTemp.value  = parseFloat(whereTemp.value);
                            }catch (e){
                                this.db.debugLog('Error: Filter parse: '+e)
                            }
                        }
                    }

                    if(that.rules[key].type == 'boolean'){
                        whereTemp.value = whereTemp.value=='true'?true:false;
                    }
                }

                if (that.rules[key].object) // si es un objecto y existe el id
                {
                    whereTemp.field = that.rules[key].paramsSearch.field;
                }

                if(that.rules[key].join){
                    whereTemp=Object.assign({},{'join':that.rules[key].join,'where':[whereTemp]});
                    if(whereTemp2)
                        whereTemp2=Object.assign({},{'join':that.rules[key].join,'where':[whereTemp2]});
                }

                dataWhere.push(whereTemp);
                if(whereTemp2)
                {
                    dataWhere.push(whereTemp2);
                }
            }
        });
        if(this.params.where && this.params.where.length > 0 ){
            let temp = dataWhere.concat(this.params.where);
            dataWhere = temp;
        }
        this.whereFilter.emit(dataWhere);
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
        })
        let where=[];
        if(this.params.where && this.params.where.length > 0 ){
             where=this.params.where;
        }
        this.whereFilter.emit(where);
    }
    //guardar condicion en el formulario
    setCondicion(cond,id){
        (<FormControl>this.form.controls[id+'Cond']).setValue(cond);
    }
    searchLength() {
        if(this.searchId)
            return Object.keys(this.searchId).length
        return 0;
    }
    searchIdKeys(){
        return Object.keys(this.searchId);
    }
    setValueSelect(data,key){
        this.data[key].setValue(data);
        if(data=='-1')
            this.data[key].setValue(null);

    }
    debugLog(log){
        console.log(log);
    }
}

