import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

export class ParamModel extends ModelBase{

    constructor(public db:DependenciesBase){
        super(db,'/params/');
        this.initModel();
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
            'title': 'Código',
            'placeholder': 'Código',
        };

        this.rules['value']={
            'type': 'textarea',
            'exclude':true,
            "showbuttons": true,
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'value',
            'title': 'Valor',
            'placeholder': 'Valor',
        };
        this.rules['type']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'String', 'text': 'String'},
                {'value': 'Long', 'text': 'Long'},
                {'value': 'Double', 'text': 'Double'},
                {'value': 'Date', 'text': 'Date'},

            ],
            'key': 'type',
            'title': 'Tipo',
            'placeholder': 'Seleccione un Tipo',
        };

        this.globalOptional();
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar parámetro";
        this.paramsSearch.placeholder="Ingrese el parámetro";
        this.paramsSearch.label.title="Codigo: ";
        this.paramsSearch.label.detail="Detalle: "
    }
    initParamsSave() {
        this.paramsSave.title="Agregar parámetro"
    }
    initRuleObject() {
        this.ruleObject.title="Parámetro";
        this.ruleObject.placeholder="Ingrese el parámetro";
        this.ruleObject.key="param";
        this.ruleObject.keyDisplay="paramKey";
        this.ruleObject.code="paramId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }
    initModelActions(){
        this.actions['delete'].params.message = '¿ Esta seguro de eliminar el parametro: ';
    }

}
