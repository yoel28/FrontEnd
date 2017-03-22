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
        params.title = "cuenta";
    }
    modelExternal() {}
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
            title: 'Logo',
            default:this.db.pathElements.company,
            placeholder: 'Logo',
        });

        this.rules['name']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'name',
            title: 'Nombre',
            placeholder: 'Nombre',
        });

        this.rules['ruc']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'ruc',
            title: 'RUC',
            placeholder: 'RUC',
        });

        this.rules['contact']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'contact',
            title: 'Contacto',
            placeholder: 'Contacto',
        });

        this.rules['address']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'address',
            icon: 'fa fa-list',
            title: 'Dirección',
            placeholder: 'Dirección',
        });

        this.rules['url']= new TextRule({
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'url',
            title: 'URL',
            placeholder: 'URL',
        });

        this.rules['email']=new TextRule({
            email:true,
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'email',
            title: 'Correo',
            placeholder: 'Correo',
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
            key: 'maxUserCount',
            title: 'Usuarios',
            placeholder: 'Usuarios',
        });

        this.rules['phone']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'phone',
            title: 'Teléfono',
            placeholder: 'Teléfono',
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
            title: 'Mini logo',
            default:this.db.pathElements.company,
            placeholder: 'Mini Logo',
        });

        this.rules = Object.assign({},this.rules,this.getRulesDefault());

    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar cuenta";
        this.paramsSearch.placeholder="Ingrese la cuenta";
        this.paramsSearch.label.title="Cuenta: ";
        this.paramsSearch.label.detail="RUC: "
    }
    initParamsSave() {
        this.paramsSave.title="Agregar cuenta"
    }
    initRuleObject() {
        this.ruleObject.title="Cuenta";
        this.ruleObject.placeholder="Ingrese la cuenta";
        this.ruleObject.key="account";
        this.ruleObject.keyDisplay='accountName';
        this.ruleObject.eval=this.db.myglobal.getRule('ACCOUNT_DISPLAY_WEB');
        this.ruleObject.code="accountId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
        delete this.rulesSave.miniLogo;
        delete this.rulesSave.logo;
    }
    initModelActions(params){
        params['delete'].message='¿ Esta seguro de eliminar la cuenta: ';
        params['delete'].key = 'name';
    }
}

