import {ModelRoot} from "../../com.zippyttech.common/modelRoot";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

export class AccountModel extends ModelRoot{

    constructor(db:DependenciesBase){
        super(db,'ACCOUNT','/accounts/');
        this.initModel();
    }
    modelExternal() {}
    initRules(){

        this.rules['logo']={
            'type': 'image',
            'exclude':true,
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'logo',
            'title': 'Logo',
            'default':this.db.pathElements.company,
            'placeholder': 'Logo',
        };

        this.rules['name']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'name',
            'title': 'Nombre',
            'placeholder': 'Nombre',
        };

        this.rules['ruc']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'ruc',
            'title': 'RUC',
            'placeholder': 'RUC',
        };

        this.rules['contact']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'contact',
            'title': 'Contacto',
            'placeholder': 'Contacto',
        };

        this.rules['address']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'address',
            'icon': 'fa fa-list',
            'title': 'Dirección',
            'placeholder': 'Dirección',
        };

        this.rules['url']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'url',
            'title': 'URL',
            'placeholder': 'URL',
        };

        this.rules['email']={
            'type': 'text',
            'required':true,
            'email':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'email',
            'title': 'Correo',
            'placeholder': 'Correo',
        };

        this.rules['maxUserCount']={
            'type': 'number',
            'exclude':true,
            'required':true,
            'step':'0.1',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'maxUserCount',
            'title': 'Usuarios',
            'placeholder': 'Usuarios',
        };

        this.rules['phone']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'phone',
            'title': 'Teléfono',
            'placeholder': 'Teléfono',
        };

        this.rules['miniLogo']={
            'type': 'image',
            'exclude':true,
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'miniLogo',
            'title': 'Mini logo',
            'default':this.db.pathElements.company,
            'placeholder': 'Mini Logo',
        };

        this.rules = Object.assign({},this.rules,this.getRulesDefault());
        delete this.rules['detail'];

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
        params['delete'].keyAction = 'name';
    }
}

