import {ModelRoot, IView} from "../../com.zippyttech.common/modelRoot";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {TextRule} from "../../com.zippyttech.common/rules/text.rule";

export class RoleModel extends ModelRoot{

    constructor(public db:DependenciesBase){
        super(db,'/roles/');
        this.initModel();
    }

    initPermissions() {}
    modelExternal() {}
    initModelActions(){}

    initView(params:IView){
        params.display = this.nameClass+"Authority";
        params.mode = 'checklist';
        params.exclude = true;
    }

    initRules(){
        this.rules['authority']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'authority',
            prefix:'ROLE_',
        });
        this.setRuleDetail(true,true,true);
        this.rules = Object.assign({},this.rules,this.getRulesDefault());
    }


    initDataActions(){
        this.dataActions.get('delete').params.message = '¿ Esta seguro de eliminar el rol : ';
    }



}