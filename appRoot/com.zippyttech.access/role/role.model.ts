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
        params.display = this.nameClass+"Authority";
        params.mode = 'checklist';
        params.exclude = true;
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
    initDataActions(){
        this.dataActions.get('delete').params.message = '¿ Esta seguro de eliminar el rol : ';
    }

    initModelActions(){}

}