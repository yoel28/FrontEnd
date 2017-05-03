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
    }

    initView(params:IView){}
    initModelExternal() {}
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
            icon: 'fa fa-key'
        });

        this.rules['url']= new TextRule({
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-key'
        });

        this.rules['component']= new SelectRule({
            components:{
                save:{
                    hidden: (form)=>{
                        return (form.getFormValue('model') && form.getFormValue('model') != '-1');
                    },
                }
            },
            disabled:'data.model!=null',
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source:[{value: 'AppComponent', text: 'AppComponent'}],
        });

        this.rules['model']=new SelectRule({
            components:{
                save:{
                    hidden: (form)=>{
                        return (form.getFormValue('component') && form.getFormValue('component') != '-1');
                    },
                }
            },
            disabled:'data.component!=null',
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source:[]
        });

        this.rules['event']= new SelectRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            source:[],
        });

        this.rules['target']= new TextRule({
            required:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-key'
        });

        this.rules['callback']= new TextareaRule({
            permissions: {
                update: this.permissions.update,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-key'
        });

        this.globalOptional();

        this.setRuleDetail(true,true);

        this.rules = Object.assign({},this.rules,this.getRulesDefault());

    }

    initDataExternal(){
        this.loadComponents();
        this.loadModels();
        this.loadEventsApi();
        this.completed=true;
    }

    loadComponents(){

        componentsApp.forEach(comp =>{
            (<ISelect>this.rules['component']).source.push({value: comp.name, text: comp.name})
        });
        componentsDefault.forEach(comp =>{
            (<ISelect>this.rules['component']).source.push({value: comp.name, text: comp.name})
        });
        componentsView.forEach(comp =>{
            (<ISelect>this.rules['component']).source.push({value: comp.name, text: comp.name})
        });

    }

    loadModels(){

        modelsDefault.forEach(model=>{
            (<ISelect>this.rules['model']).source.push({value: model.name, text: model.name})
        });
        modelsApp.forEach(model=>{
            (<ISelect>this.rules['model']).source.push({value: model.name, text: model.name})
        });

    }

    loadEventsApi(){

        if(this.db.myglobal.publicData && this.db.myglobal.publicData.channel && this.db.myglobal.publicData.channel.eventTypes)
        {
            this.db.myglobal.publicData.channel.eventTypes.forEach(ev =>{
                (<ISelect>this.rules['event']).source.push({value:ev, text: ev})
            });
        }

    }



}