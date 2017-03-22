import {ModelRoot, IView} from "../../com.zippyttech.common/modelRoot";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {TextRule} from "../../com.zippyttech.common/rules/text.rule";

export class PermissionModel extends ModelRoot{

    constructor(public db:DependenciesBase){
        super(db,'/permissions/');
        this.initModel();
    }
    initView(params:IView){
        params.title = "permiso";
    }
    modelExternal() {}
    initRules(){

        this.rules['code'] = new TextRule({
            required:true,
            key: 'code',
            title: 'Código',
            placeholder: 'Código',
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            }
        });

        this.rules['title']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'title',
            title: 'Título',
            placeholder: 'Título',
        });

        this.rules['module']=new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'module',
            title: 'Módulo',
            placeholder: 'Módulo',
        });

        this.rules['controlador']= new TextRule({
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'controlador',
            title: 'Controlador',
            placeholder: 'Controlador',
        });

        this.rules['accion']=new TextRule({
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'accion',
            title: 'Acción',
            placeholder: 'Acción',
        });

        this.setRuleDetail(true,true);

        this.rules = Object.assign({},this.rules,this.getRulesDefault());
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar permiso";
        this.paramsSearch.placeholder="Ingrese permiso";
        this.paramsSearch.label.title="Código: ";
        this.paramsSearch.label.detail="Detalle: "
    }
    initParamsSave() {
        this.paramsSave.title="Agregar permiso"
    }
    initRuleObject() {
        this.ruleObject.title="permiso";
        this.ruleObject.placeholder="Ingrese permiso";
        this.ruleObject.key="permission";
        this.ruleObject.keyDisplay="permissionCode";
        this.ruleObject.code="permissionId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }
    initModelActions(params){
        params['delete'].message = '¿ Esta seguro de eliminar el permiso : ';
    }

}