import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {TextRule} from "../../com.zippyttech.common/rules/text.rule";
import {TextareaRule} from "../../com.zippyttech.common/rules/textarea.rule";
import {IView} from "../../com.zippyttech.common/modelRoot";

export class RuleModel extends ModelBase{

    constructor(public db:DependenciesBase){
        super(db,'/rules/');
        this.initModel();
    }

    initView(params:IView){
        params.title = "Regla";
    }

    modelExternal() {}
    initRules(){
        this.rules['code']= new TextRule({
            required:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key:'code',
            icon: 'fa fa-key',
            title:'Código',
            placeholder:'Código',
        });
        this.rules['rule']= new TextareaRule({
            required:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key:'rule',
            icon: 'fa fa-key',
            title:'Regla',
            placeholder:'Regla',
        });
        this.rules['title']= new TextRule({
            required:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key:'title',
            icon: 'fa fa-list',
            title:'Título',
            placeholder:'Título',
        });
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

    initDataActions(){
        this.dataActions.get('delete').params.message = '¿ Esta seguro de eliminar la regla: ';
    }
    initModelActions(){}
}