import {ModelRoot, IView} from "../../com.zippyttech.common/modelRoot";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {TextRule} from "../../com.zippyttech.common/rules/text.rule";

export class RoleModel extends ModelRoot{

    constructor(public db:DependenciesBase){
        super(db,'/roles/');
        this.initModel();
    }
    initView(params:IView){
        params.title = "Rol";
        params.display = "authority";
    }
    modelExternal() {}
    initRules(){
        this.rules['authority']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'authority',
            title: 'Rol',
            prefix:'ROLE_',
            placeholder: 'Nombre del perfil',
        });
        this.rules = Object.assign({},this.rules,this.getRulesDefault());
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar rol";
        this.paramsSearch.placeholder="Ingrese el rol";
        this.paramsSearch.label.title="Título: ";
        this.paramsSearch.label.detail="Detalle: "
    }
    initParamsSave() {
        this.paramsSave.title="Agregar rol"
    }
    initRuleObject() {
        this.ruleObject.title="Roles";
        this.ruleObject.placeholder="Ingrese un rol";
        this.ruleObject.key="roles";
        this.ruleObject.keyDisplay="roleAuthority";
        this.ruleObject.code="roleId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }
    initModelActions(params){
        params['delete'].message = '¿ Esta seguro de eliminar el rol : ';
        params['delete'].key = 'authority';
    }

}