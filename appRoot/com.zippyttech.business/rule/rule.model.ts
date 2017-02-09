import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

export class RuleModel extends ModelBase{

    constructor(public db:DependenciesBase){
        super(db,'RULE','/rules/');
        this.initModel();
    }
    modelExternal() {}
    initRules(){
        this.rules['code']={
            'type':'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key':'code',
            'icon': 'fa fa-key',
            'title':'Código',
            'placeholder':'Código',
        };
        this.rules['rule']={
            'type':'textarea',
            "showbuttons": true,
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key':'rule',
            'icon': 'fa fa-key',
            'title':'Regla',
            'placeholder':'Regla',
        };
        this.rules['title']={
            'type':'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key':'title',
            'icon': 'fa fa-list',
            'title':'Título',
            'placeholder':'Título',
        };
        this.globalOptional();
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar regla";
        this.paramsSearch.placeholder="Ingrese código de la regla";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar regla"
    }
    initRuleObject() {
        this.ruleObject.title="Regla";
        this.ruleObject.placeholder="Ingrese código de la regla";
        this.ruleObject.key="rule";
        this.ruleObject.keyDisplay = "ruleCode";
        this.ruleObject.code = "ruleId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }
    initParamsDelete(params){
        params.message = '¿ Esta seguro de eliminar la regla: ';
    }
    initModelActions(params){}
}