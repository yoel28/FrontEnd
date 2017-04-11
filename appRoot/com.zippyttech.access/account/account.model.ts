import {ModelRoot, IView} from "../../com.zippyttech.common/modelRoot";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {ImageRule} from "../../com.zippyttech.common/rules/image.rule";
import {TextRule} from "../../com.zippyttech.common/rules/text.rule";
import {NumberRule} from "../../com.zippyttech.common/rules/number.rule";

export class AccountModel extends ModelRoot{

    constructor(db:DependenciesBase){
        super(db,'/accounts/');
        this.initModel();
    }

    initView(params:IView){
        params.display = this.nameClass+"Name";
        params.eval = this.db.myglobal.getRule('ACCOUNT_DISPLAY_WEB');
    }

    modelExternal(){}
    initPermissions(){}
    initModelActions(){}

    initRules(){

        this.rules['logo']= new ImageRule({
            permissions:{
                update:this.permissions.update,
                visible:this.permissions.visible,
            },
            include:{
                filter:false,
                save:false,
                list:true,
            },
            exclude:true,
            key: 'logo',
            default:this.db.pathElements.company
        });

        this.rules['name']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'name'
        });

        this.rules['ruc']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'ruc'
        });

        this.rules['contact']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'contact'
        });

        this.rules['address']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'address',
            icon: 'fa fa-list'
        });

        this.rules['url']= new TextRule({
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'url'
        });

        this.rules['email']=new TextRule({
            email:true,
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'email'
        });

        this.rules['maxUserCount']= new NumberRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            exclude:true,
            step:'0.1',
            key: 'maxUserCount'
        });

        this.rules['phone']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'phone'
        });

        this.rules['miniLogo']=new ImageRule({
            permissions:{
                update:this.permissions.update,
                visible:this.permissions.visible,
                search:false,
            },
            include:{
                filter:false,
                save:false,
                list:true,
            },
            exclude:true,
            key: 'miniLogo',
            default:this.db.pathElements.company
        });

        this.rules = Object.assign({},this.rules,this.getRulesDefault());

    }

    initDataActions(){
        this.dataActions.get('delete').params.message='¿ Esta seguro de eliminar la cuenta: ';
    }
}

