import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {RoleModel} from "../role/role.model";
import {StaticValues} from "../../com.zippyttech.utils/catalog/staticValues";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

export class UserModel extends ModelBase{
    private role:any;
    public pathElements=StaticValues.pathElements;

    constructor(public db:DependenciesBase){
        super(db,'/users/');
        this.initModel(false);
        this.loadDataExternal();
    }
    modelExternal() {
        this.role= new RoleModel(this.db);
    }
    initRules(){
        this.rules['email']={
            'type': 'text',
            'email':true,
            'required':true,
            'setEqual':'username',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'email',
            'title': 'Correo electrónico',
            'placeholder': 'Correo electrónico',
        };

        this.rules['idCard']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'idCard',
            'title': 'Cédula',
            'placeholder': 'Cédula',
        };
        this.rules['username']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'username',
            'title': 'Usuario',
            'placeholder': 'Usuario',
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
        this.rules['phone']={
            'type': 'text',
            'forceInSave':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'phone',
            'title': 'Teléfono',
            'placeholder': 'Teléfono',
        };

        this.rules['image']={
            'type': 'image',
            'exclude':true,
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'image',
            'default':this.db.pathElements.robot,
            'title': 'Imagen',
            'placeholder': 'Imagen',
        };
        this.rules["accountLocked"] = {
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'search':this.permissions.filter,
            'icon': 'fa fa-list',
            "type": "boolean",
            'source': [
                {
                    'value': true,
                    'text': 'Sin verificar',
                    'class': 'btn-transparent  text-red',
                    'title': 'Sin verificar',
                    'icon': 'fa fa-exclamation-circle'
                },
                {
                    'value': false,
                    'text': 'Verificado',
                    'class': 'btn-transparent text-blue',
                    'title': 'Verificado',
                    'icon': 'fa fa-check-circle'
                }
            ],
            "key": "accountLocked",
            "title": "Verificada",
            "placeholder": "¿Cuenta verificada?",
        };

        this.rules['roles']=this.role.ruleObject;
        this.rules['roles'].type= 'checklist';
        this.rules['roles'].update= this.permissions.update;
        this.rules['roles'].mode= 'popup';
        this.rules['roles'].showbuttons=true;
        this.rules['roles'].source=[];
        this.rules['roles'].search=false;
        this.rules['roles'].exclude=true;

        this.rules['password']={
            'type': 'password',
            'required':true,
            'exclude':true,
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'password',
            'showbuttons':true,
            'title': 'Contraseña',
            'placeholder': 'Contraseña',
        };


        this.rules = Object.assign({},this.rules,this.getRulesDefault());
        delete this.rules['detail'];
    }
    public updateProfile(){
        this.setEndpoint('/auto/update');
        this.rules['email'].update=true;
        this.rules['idCard'].update=true;
        this.rules['username'].update=true;
        this.rules['name'].update=true;
        this.rules['phone'].update=true;
        this.rules['image'].update=true;
        this.rules['roles'].update=true;
        this.rules['password'].update=true;
    }

    initPermissions() {
        this.permissions['roleSave']=this.db.myglobal.existsPermission(['USER_ROLE_SAVE'])
    }
    initParamsSearch() {
        this.paramsSearch.title="Buscar usuario";
        this.paramsSearch.placeholder="Ingrese el usuario";
        this.paramsSearch.label.title="Alias: ";
        this.paramsSearch.label.detail=""
    }
    initParamsSave() {
        this.paramsSave.title="Agregar usuario"
    }
    initRuleObject() {
        this.ruleObject.title="Usuario";
        this.ruleObject.placeholder="Ingrese el usuario";
        this.ruleObject.keyDisplay='user';
        this.ruleObject.key='user';
        this.ruleObject.eval=this.db.myglobal.getRule('USER_DISPLAY_WEB');
        this.ruleObject.code="userId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.id;
        delete this.rulesSave.roles;
        delete this.rulesSave.enabled;
        delete this.rulesSave.image;
        delete this.rulesSave.accountLocked;
        delete this.rulesSave.username;
    }
    loadDataExternal() {
        if(this.db.myglobal.publicData && this.db.myglobal.publicData['roles'])
        {
            this.loadRoles();
        }
        else {
            this.role.loadData().then((response => {
                if(this.role.dataList && this.role.dataList.list)
                {
                    this.db.myglobal.publicData['roles']=this.role.dataList.list;
                    this.loadRoles();
                }
            }).bind(this));
        }
    }
    loadRoles(){
        this.db.myglobal.publicData['roles'].forEach((obj=> {
            if(this.rules['roles']){
                this.rules['roles'].source.push({'value': obj.id, 'text': obj.authority});
            }
        }).bind(this));
        this.completed = true;
    }
    initModelActions(params){
        params['delete'].message='¿ Esta seguro de eliminar el usuario: ';
        params['delete'].key = 'username';
    }

}
