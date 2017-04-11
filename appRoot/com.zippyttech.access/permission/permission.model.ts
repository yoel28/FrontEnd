import {ModelRoot, IView} from "../../com.zippyttech.common/modelRoot";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {TextRule} from "../../com.zippyttech.common/rules/text.rule";

export class PermissionModel extends ModelRoot{

    constructor(public db:DependenciesBase){
        super(db,'/permissions/');
        this.initModel();
    }

    initView(params:IView){}
    initPermissions() {}
    initModelActions(){}
    modelExternal() {}
    initDataActions(){}

    initRules(){

        this.rules['code'] = new TextRule({
            required:true,
            key: 'code',
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
            key: 'title'
        });

        this.rules['module']=new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'module'
        });

        this.rules['controlador']= new TextRule({
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'controlador'
        });

        this.rules['accion']=new TextRule({
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'accion'
        });

        this.setRuleDetail(true,true);

        this.rules = Object.assign({},this.rules,this.getRulesDefault());
    }





}