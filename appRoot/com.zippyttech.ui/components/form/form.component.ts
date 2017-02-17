import {Component, EventEmitter, OnInit, AfterViewInit, HostListener} from "@angular/core";
import  {FormControl, Validators, FormGroup} from '@angular/forms';

import {RestController} from "../../../com.zippyttech.rest/restController";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";

var jQuery = require('jquery');

@Component({
    moduleId:module.id,
    selector: 'form-view',
    templateUrl: 'index.html',
    styleUrls: [ 'style.css'],
    inputs:['params','rules'],
    outputs:['save','getInstance','getForm'],
})
export class FormComponent extends RestController implements OnInit,AfterViewInit{

    public params:any={};

    public rules:any={};
    public dataSelect:any={};
    public dataListMultiple:any={};//arraay para opciones multiples

    public save:any;
    public getInstance:any;
    public getForm:any;

    public form:FormGroup;
    public data:any = {};
    public keys:any = {};

    public delete=false;

    constructor(public db:DependenciesBase) {
        super(db);
        this.save = new EventEmitter();
        this.getInstance = new EventEmitter();
        this.getForm = new EventEmitter();

    }
    ngOnInit(){
        this.initForm();
        this.getForm.emit(this.form);
    }
    ngAfterViewInit(){
        this.getInstance.emit(this);
        if(this.params.prefix && !this.db.myglobal.objectInstance[this.params.prefix])
        {
            this.db.myglobal.objectInstance[this.params.prefix]={};
            this.db.myglobal.objectInstance[this.params.prefix]=this;
        }
    }

    initForm() {
        let that = this;
        Object.keys(this.rules).forEach((key)=> {
            if((that.params.onlyRequired && (that.rules[key].required || that.rules[key].forceInSave)) || !that.params.onlyRequired){
                that.data[key] = [];
                let validators=[];
                if(that.rules[key].required)
                    validators.push(Validators.required);
                if(that.rules[key].maxLength)
                    validators.push(Validators.maxLength(that.rules[key].maxLength));
                if(that.rules[key].minLength)
                    validators.push(Validators.minLength(that.rules[key].minLength));
                if(that.rules[key].object)
                {
                    validators.push(
                        (c:FormControl)=> {
                            if(c.value && c.value.length > 0){
                                if(that.searchId[key]){
                                    if(that.searchId[key].detail == c.value)
                                        return null;
                                }
                                return that.rules[key].objectOrSave?null:{object: {valid: true}};
                            }
                            return null;
                        });
                }
                if(that.rules[key].email)
                {
                    validators.push(
                        (c:FormControl)=> {
                            if(c.value && c.value.length > 0) {
                                let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
                                return EMAIL_REGEXP.test(c.value) ? null : {'email': {'valid': true}};
                            }
                            return null;
                        });
                }
                if(that.rules[key].customValidator){
                    validators.push(that.rules[key].customValidator);
                }
                if(that.rules[key].type=='select' || that.rules[key].type=='boolean'){
                    validators.push(
                        (c:FormControl)=> {
                            if(c.value && c.value.length > 0){
                                if(c.value!='-1' || (c.value=='-1' && !that.rules[key].required)){
                                        return null;
                                }
                                return {error: {valid: false}};
                            }
                            return null;
                        });
                }

                that.data[key] = new FormControl('',Validators.compose(validators));
                if(that.rules[key].value)
                    that.data[key].setValue(that.rules[key].value);


                if(that.rules[key].object)
                {
                    that.data[key]
                        .valueChanges
                        .debounceTime(500)
                        .subscribe((value: string) => {
                            that.findControl = value;
                            if(value && value.length > 0){
                                that.search=that.rules[key];
                                that.dataList=[];
                                if( !that.searchId[key]){
                                    that.getSearch(null,value);
                                }
                                else if(that.searchId[key].detail != value){
                                    delete that.searchId[key];
                                    that.getSearch(null,value);
                                }
                                else{
                                    this.findControl="";
                                    that.search = [];
                                }
                            }
                            else {
                                if(that.search && that.search.key == key)
                                    that.getSearch(null,'');
                            }
                        });
                }
            }

        });
        this.keys = Object.keys(this.data);
        this.form = new FormGroup(this.data);
    }
    @HostListener('keydown', ['$event'])
    keyboardInput(event: any) {
        if(event.code=="Enter" || event.code=="NumpadEnter"){
            let key = event.path[0].accessKey;
            if(key && this.rules[key] && this.rules[key].object){
                this.loadAndSetDataSearch(true);
            }
        }
    }

    public findControl:string="";

    submitForm(event?){
        if(event)
        event.preventDefault();
        let that = this;
        let successCallback= response => {
            that.addToast('Notificacion','Guardado con éxito');
            that.resetForm();
            that.save.emit(response.json());
        };
        this.setEndpoint(this.params.endpoint);
        let body = this.getFormValues();
        if(this.params.updateField)
            this.httputils.onUpdate(this.endpoint+this.rest.id,JSON.stringify(body),this.dataSelect,this.error);
        else
            this.httputils.doPost(this.endpoint,JSON.stringify(body),successCallback,this.error);
    }
    public getFormValues(addBody=null){
        let that = this;
        let body = Object.assign({},this.form.value);
        Object.keys(body).forEach((key:string)=>{
            if(that.rules[key]){
                if(that.rules[key].object){
                    if(that.rules[key].object){
                        if(!that.rules[key].objectOrSave){
                            body[key]=that.searchId[key]?(that.searchId[key].id||null): null;
                        }
                        else{
                            if(that.searchId[key] && that.searchId[key].id){
                                body[key]=that.searchId[key].id;
                            }
                            else if(!body[key] || body[key]=='')
                                body[key]=null;
                        }
                    }

                }
                if(that.rules[key].type == 'number' && body[key]!=""){
                    body[key]=parseFloat(body[key]);
                }
                if(that.rules[key].type == 'select' && body[key]=="-1"){
                    body[key]=null;
                }
                if(that.rules[key].type == 'boolean' && body[key]!=""){
                    if(typeof body[key] === 'string')
                        body[key]=body[key]=='true'?true:false;
                }
                if(that.rules[key].prefix && that.rules[key].type=='text' && body[key]!="" && !that.rules[key].object)
                {
                    body[key] = that.rules[key].prefix + body[key];
                }
                if(that.rules[key].setEqual){
                    body[that.rules[key].setEqual] = body[key];
                }
                if(that.rules[key].type=='list'){
                    let data=[];
                    body[key].forEach(obj=>{
                        data.push(obj.value || obj);
                    });
                    body[key]=data;
                }
            }
        });
        if(addBody && typeof addBody == 'object'){ //TODO:agregar parametros extrar... no implementado
            Object.assign(body,body,addBody);
        }
        return body;
    }
    //objecto del search actual
    public search:any={};
    public searchView=false;
    //Lista de id search
    public searchId:any={};
    //Al hacer click en la lupa guarda los valores del objecto
    getLoadSearch(event,data){
        event.preventDefault();
        this.rest.max=5;
        this.searchView=true;
        this.findControl=this.data[data.key].value || '';
        this.search=data;
        this.getSearch(event,this.findControl);
    }
    //accion al dar click en el boton de buscar del formulario en el search
    getSearch(event=null,value){
        let that=this;
        if(event)
            event.preventDefault();
        this.setEndpoint(this.search.paramsSearch.endpoint+value);
        this.loadData().then(response=>{
            if(that.search && that.search.key){
                this.search.paramsSearch.count = this.dataList.count;
                if(that.rules[that.search.key] && !that.rules[that.search.key].objectOrSave){
                    that.loadAndSetDataSearch(this.searchView);
                }
            }
        });
    }
    loadAndSetDataSearch(searchView=false){
        if(this.dataList && this.dataList.count && this.dataList.count==1)//cuando existe un solo elemento se carga automatico
        {
            this.getDataSearch(this.dataList.list[0]);
        }

        else if(this.dataList && this.dataList.count && this.dataList.count > 1){
            this.searchView = searchView;
        }

    }
    //accion al dar click en el boton de cerrar el formulario
    searchQuit(event){
        event.preventDefault();
        this.searchView=false;
        this.search={};
        this.dataList={};
    }
    //accion al seleccion un parametro del search
    getDataSearch(data){
        this.searchView=false;
        this.searchId[this.search.key]={'id':data.id,'title':data.title,'detail':data.detail,'data':data};
        (<FormControl>this.form.controls[this.search.key]).setValue(data.detail);
        this.dataList=[];
    }
    //accion seleccionar un item de un select
    setValueSelect(data,key){
        (<FormControl>this.form.controls[key]).setValue(data);
        if(data=='-1')
            (<FormControl>this.form.controls[key]).setValue(null);
    }
    resetForm(){
        let that=this;
        this.search={};
        this.searchId={};
        this.dataListMultiple={};
        this.delete=false;
        this.params.updateField=false;
        Object.keys(this.data).forEach(key=>{
            (<FormControl>that.data[key]).setValue(null);
            (<FormControl>that.data[key]).setErrors(null);
            that.data[key]._pristine=true;
            if(that.rules[key].readOnly)
                that.rules[key].readOnly=false;
        })
    }
    public refreshFieldKey='';
    refreshField(event,data){
        if(event)
            event.preventDefault();
        let that = this;
        this.refreshFieldKey=data.key;
        if(data.refreshField.endpoint){
            this.rest.findData=true;
            let successCallback= response => {
                that.refreshFieldKey = '';
                that.rest.findData=false;
                try {
                    let val = response.json()[data.refreshField.field];
                    if(data.refreshField.callback)
                        data.refreshField.callback(data,response.json(),that.data[data.key]);
                    else
                        that.data[data.key].setValue(val);
                }catch (e){
                    console.log(e);
                }

            }
            let error = (err)=>{
                that.refreshFieldKey='';
                that.error(err);
            }
            this.httputils.doGet(data.refreshField.endpoint,successCallback,error,data.refreshField.absolute);
        }
        else{
            if(that.rules[data.key].type=='list')
                that.data[data.key].value.push(eval(data.refreshField.eval));
        }
    }
    makeTextRandon():string
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 20; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    setColor(data,key){
        this.data[key].setValue(data);
    }
    changeImage(data,key){
        (<FormControl>this.form.controls[key]).setValue(data);
    }

    setLoadDataModel(data,_delete=false)
    {
        let that = this;
        this.resetForm();
        if(data.id)
        {
            this.rest.id = data.id;
            Object.keys(data).forEach(key=>{
                if(that.data[key])
                {
                    (<FormControl>that.form.controls[key]).setValue(data[key]);
                    that.data[key].setValue(data[key]);
                }
            })
            that.params.updateField=true;
            Object.assign(this.dataSelect,data);
        }
        this.delete = _delete;
    }
    public getKeys(data){
        return Object.keys(data || {});
    }
    loadDate(data,key){
        this.data[key].setValue(data.date);
    }
    addListMultiple(event,key){
        if(!this.dataListMultiple[key])
            this.dataListMultiple[key]={'view':false,'data':[]};
        this.dataListMultiple[key].data.push(this.form.controls[key].value);
        this.form.controls[key].setValue(null);
    }
    viewListMultiple(event,key){
        if(event)
            event.preventDefault();
        this.dataListMultiple[key].view=!this.dataListMultiple[key].view;
    }
    deleteListMultiple(event,key,data){
        if(event)
            event.preventDefault();
        let index = this.dataListMultiple[key].data.findIndex(obj => obj == data);
        if(index!=-1)
            this.dataListMultiple[key].data.splice(index,1);

    }
    hiddenFormControl(exp='false'){
        return eval(exp);
    }

    isValidForm():boolean{
        if(this.form && this.form.valid){
            return this.params.customValidator?this.params.customValidator(this):true;
        }
        return false
    }
    addTagManual(event,key){
        if(event)
            event.preventDefault();
        let tag=jQuery('#'+key+'manual').val();
        if(tag && tag.length)
        {
            jQuery('#'+key+'manual').val('');
            this.rules[key].refreshField.instance.addValue(
                {
                    'id': 0,
                    'value': tag,
                    'title': 'Entrada manual'
                }
            );
        }

    }
}