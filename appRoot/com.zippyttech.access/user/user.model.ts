import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {RoleModel} from "../role/role.model";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {IView} from "../../com.zippyttech.common/modelRoot";
import {TextRule} from "../../com.zippyttech.common/rules/text.rule";
import {ImageRule} from "../../com.zippyttech.common/rules/image.rule";
import {BooleanRule} from "../../com.zippyttech.common/rules/boolean.rule";
import {PasswordRule} from "../../com.zippyttech.common/rules/password.rule";
import {ObjectRule} from "../../com.zippyttech.common/rules/object.rule";

export class UserModel extends ModelBase{

    private role:any;
    constructor(public db:DependenciesBase){
        super(db,'/users/');
        this.initModel(false);
        this.loadDataExternal();
    }

    initDataActions(){}
    initModelActions(){}

    modelExternal() {
        this.role= new RoleModel(this.db);
    }
    initView(params:IView){
        params.display = this.nameClass+"Username";
        params.eval = this.db.myglobal.getRule('USER_DISPLAY_WEB');
    }

    initRules(){

        this.rules['email']= new TextRule({
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            email:true,
            required:true,
            // 'setEqual':'username', //TODO: ubicar clave en components form
            key: 'email'
        });

        this.rules['idCard']= new TextRule({
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'idCard',
        });

        this.rules['username']= new TextRule({
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            include:{
                save:false,
                list:true,
                filter:true
            },
            key: 'username'
        });

        this.rules['name']= new TextRule({
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            required:true,
            key: 'name',
        });

        this.rules['phone']=new TextRule({
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            components:{
                save:{
                    force:true //TODO: Agregar regla en el form
                }
            },
            key: 'phone'
        });

        this.rules['image']= new ImageRule({
            permissions:{
                update:this.permissions.update,
                visible:this.permissions.visible,
            },
            include:{
                save:false,
                list:true,
                filter:false
            },
            exclude:true,
            key: 'image'
        });

        this.rules["accountLocked"] = new BooleanRule({
            permissions:{
                update:this.permissions.update,
                visible:this.permissions.visible,
                search:this.permissions.filter,
            },
            include:{
                save:false,
                list:true,
                filter:true
            },
            source: [
                {
                    value: true,
                    text: 'Sin verificar',
                    class: 'btn-transparent  text-red',
                    title: 'Sin verificar',
                    icon: 'fa fa-exclamation-circle'
                },
                {
                    value: false,
                    text: 'Verificado',
                    class: 'btn-transparent text-blue',
                    title: 'Verificado',
                    icon: 'fa fa-check-circle'
                }
            ],
            key: "accountLocked",
        });

        this.rules['roles']=new ObjectRule({
            model: this.role,
            required:false,
            update:this.permissions.update,
            source:[],
            include:{
                list:true,
                save:false,
                filter:false
            }
        });

        this.rules['password']= new PasswordRule({
            permissions:{
                update:this.permissions.update,
                visible:this.permissions.visible,
            },
            required:true,
            exclude:true,
            minLength:6,
            key: 'password',
            showbuttons:true,
        });

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
                this.rules['roles'].source.push({value: obj.id, text: obj.authority});
            }
        }).bind(this));
        this.completed = true;
    }

}
