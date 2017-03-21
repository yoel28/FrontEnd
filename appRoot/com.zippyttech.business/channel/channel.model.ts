import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {componentsApp, componentsDefault, componentsView, modelsDefault, modelsApp} from "../../app-routing.module";

export class ChannelModel extends ModelBase{

    constructor(public db:DependenciesBase){
        super(db,'/channels/');
        this.initModel(false);
        this.loadDataModel();
    }
    modelExternal() {}
    initRules(){

        this.rules['code']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'code',
            'icon': 'fa fa-key',
            'title': 'Código',
            'placeholder': 'Ingrese el código',
        };

        this.rules['url']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'url',
            'icon': 'fa fa-key',
            'title': 'URL',
            'placeholder': 'URL',
        };

        this.rules['component']={
            'type': 'select',
            'hiddenOnly':'this.form.controls["model"].value && this.form.controls["model"].value!="-1"',
            'disabled':'data.model!=null',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'component',
            'source':[{'value': 'AppComponent', 'text': 'AppComponent'}],
            'title': 'Componente',
            'placeholder': 'Seleccione un componente',
        };

        this.rules['model']={
            'type': 'select',
            'hiddenOnly':'this.form.controls["component"].value && this.form.controls["component"].value!="-1"',
            'disabled':'data.component!=null',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'model',
            'source':[],
            'title': 'Modelo',
            'placeholder': 'Seleccione un modelo',
        };

        this.rules['event']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'event',
            'source':[],
            'title': 'Evento',
            'placeholder': 'Seleccione un evento',
        };

        this.rules['target']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'target',
            'icon': 'fa fa-key',
            'title': 'Canal',
            'placeholder': 'Canal',
        };

        this.rules['callback']={
            'type': 'textarea',
            "showbuttons": true,
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'callback',
            'icon': 'fa fa-key',
            'title': 'callback',
            'placeholder': 'callback',
        };

        this.globalOptional();

        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar canal";
        this.paramsSearch.placeholder="Ingrese codigo del canal";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar canal"
    }
    initRuleObject() {
        this.ruleObject.title="Canal";
        this.ruleObject.placeholder="Ingrese codigo del canal";
        this.ruleObject.key="channel";
        this.ruleObject.keyDisplay="channelCode";
        this.ruleObject.keyDisplay="channelId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
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
            that.rules['component'].source.push({'value': comp.name, 'text': comp.name})
        });
        componentsDefault.forEach(comp =>{
            that.rules['component'].source.push({'value': comp.name, 'text': comp.name})
        });
        componentsView.forEach(comp =>{
            that.rules['component'].source.push({'value': comp.name, 'text': comp.name})
        });
    }
    loadModels(){
        let that = this;
        modelsDefault.forEach(model=>{
            that.rules['model'].source.push({'value': model.name, 'text': model.name})
        });
        modelsApp.forEach(model=>{
            that.rules['model'].source.push({'value': model.name, 'text': model.name})
        });
    }
    loadEventsApi(){
        let that=this;
        if(this.db.myglobal.publicData && this.db.myglobal.publicData.channel && this.db.myglobal.publicData.channel.eventTypes)
        {
            this.db.myglobal.publicData.channel.eventTypes.forEach(ev =>{
                that.rules['event'].source.push({'value':ev, 'text': ev})
            });
        }
    }
    initModelActions(){
        this.actions['delete'].params.message = '¿ Esta seguro de eliminar el canal : ';
    }

}