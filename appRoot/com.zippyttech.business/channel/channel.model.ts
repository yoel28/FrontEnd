import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {componentsApp, componentsDefault, componentsView} from "../../app-routing.module";

export class ChannelModel extends ModelBase{

    constructor(public db:DependenciesBase){
        super(db,'CH','/channels/');
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
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'component',
            'source':[],
            'icon': 'fa fa-key',
            'title': 'Componente',
            'placeholder': 'Seleccione un componente',
        };

        this.rules['target']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'target',
            'icon': 'fa fa-key',
            'title': 'Objetivo',
            'placeholder': 'Objetivo',
        };

        this.rules['callback']={
            'type': 'text',
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
        this.completed=true;
    }

}