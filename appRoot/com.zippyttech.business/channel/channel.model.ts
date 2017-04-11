import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {componentsApp, componentsDefault, componentsView, modelsDefault, modelsApp} from "../../app-routing.module";
import {TextRule} from "../../com.zippyttech.common/rules/text.rule";
import {SelectRule, ISelect} from "../../com.zippyttech.common/rules/select.rule";
import {TextareaRule} from "../../com.zippyttech.common/rules/textarea.rule";
import {IView} from "../../com.zippyttech.common/modelRoot";

export class ChannelModel extends ModelBase{

    constructor(public db:DependenciesBase){
        super(db,'/channels/');
        this.initModel(false);
        this.loadDataModel();
    }

    initView(params:IView){}
    modelExternal() {}
    initPermissions() {}
    initModelActions(){}
    initDataActions(){}

    initRules(){

        this.rules['code']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'code',
            icon: 'fa fa-key'
        });

        this.rules['url']= new TextRule({
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key: 'url',
            icon: 'fa fa-key'
        });

        this.rules['component']= new SelectRule({
            components:{
                save:{
                    hidden:'this.form.controls["model"].value && this.form.controls["model"].value!="-1"',
                }
            },
            disabled:'data.model!=null',
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key: 'component',
            source:[{value: 'AppComponent', text: 'AppComponent'}],
        });

        this.rules['model']=new SelectRule({
            components:{
                save:{
                    hidden:'this.form.controls["component"].value && this.form.controls["component"].value!="-1"',
                }
            },
            disabled:'data.component!=null',
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key: 'model',
            source:[]
        });

        this.rules['event']= new SelectRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'event',
            source:[],
        });

        this.rules['target']= new TextRule({
            required:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key: 'target',
            icon: 'fa fa-key'
        });

        this.rules['callback']= new TextareaRule({
            permissions: {
                update: this.permissions.update,
                visible: this.permissions.visible,
            },
            key: 'callback',
            icon: 'fa fa-key'
        });
        this.globalOptional();

        this.setRuleDetail(true,true);

        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }

    loadDataModel(){
        this.loadComponents();
        this.loadModels();
        this.loadEventsApi();
        this.completed=true;
    }

    loadComponents(){
        let that=this;
        componentsApp.forEach(comp =>{
            (<ISelect>that.rules['component']).source.push({value: comp.name, text: comp.name})
        });
        componentsDefault.forEach(comp =>{
            (<ISelect>that.rules['component']).source.push({value: comp.name, text: comp.name})
        });
        componentsView.forEach(comp =>{
            (<ISelect>that.rules['component']).source.push({value: comp.name, text: comp.name})
        });
    }

    loadModels(){
        let that = this;
        modelsDefault.forEach(model=>{
            (<ISelect>that.rules['model']).source.push({value: model.name, text: model.name})
        });
        modelsApp.forEach(model=>{
            (<ISelect>that.rules['model']).source.push({value: model.name, text: model.name})
        });
    }

    loadEventsApi(){
        if(this.db.myglobal.publicData && this.db.myglobal.publicData.channel && this.db.myglobal.publicData.channel.eventTypes)
        {
            this.db.myglobal.publicData.channel.eventTypes.forEach((ev =>{
                (<ISelect>this.rules['event']).source.push({value:ev, text: ev})
            }).bind(this));
        }
    }



}