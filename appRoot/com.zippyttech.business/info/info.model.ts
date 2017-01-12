import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

export class InfoModel extends ModelBase{

    constructor(public db:DependenciesBase){
        super(db,'INFO','/infos/');
        this.initModel();
    }
    modelExternal() {}
    initRules(){
        this.rules['code']={
            'type': 'text',
            'readOnly':false,
            'protected':true,
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'code',
            'icon': 'fa fa-key',
            'title': 'Codigo',
            'placeholder': 'Ingrese el codigo',
        }
        this.rules['title']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'title',
            'icon': 'fa fa-key',
            'title': 'Título',
            'placeholder': 'Ingrese el título',
        }
        this.rules['color']={
            'type': 'color',
            'required':true,
            'update':this.permissions.update,
            'search':false,
            'visible':this.permissions.visible,
            'key': 'color',
            'value':'00ff00',
            'title': 'Color',
            'placeholder': '#000',
        }
        this.rules['position']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'top', 'text': 'Arriba'},
                {'value': 'bottom', 'text':'Abajo'},
                {'value': 'left', 'text': 'Izquierda'},
                {'value': 'right', 'text': 'Derecha'},
            ],
            'key': 'position',
            'title': 'Posición',
            'placeholder': 'Selecccione una posición',
        }
        this.rules['size']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'fa', 'text': 'Normal'},
                {'value': 'fa-lg', 'text':'Lg'},
                {'value': 'fa-2x', 'text':'2x'},
                {'value': 'fa-3x', 'text':'3x'},
                {'value': 'fa-4x', 'text':'4x'},
                {'value': 'fa-5x', 'text':'5x'},

            ],
            'key': 'size',
            'title': 'Tamaño',
            'placeholder': 'Selecccione un tamaño',
        }
        this.rules['icon']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'fa fa-question-circle', 'text': 'Interrogante 1'},
                {'value': 'fa fa-question', 'text': 'Interrogante 2'},
            ],
            'key': 'icon',
            'title': 'Icono',
            'placeholder': 'Selecccione un icono',
        }
        
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar ayuda";
        this.paramsSearch.placeholder="Ingrese codigo de la ayuda";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar ayuda"
    }
    initRuleObject() {
        this.ruleObject.title="Ayuda";
        this.ruleObject.placeholder="Ingrese codigo de la ayuda";
        this.ruleObject.key="info";
        this.ruleObject.keyDisplay="infoCode";
        this.ruleObject.keyDisplay="infoId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}