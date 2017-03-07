import {Component, OnInit} from '@angular/core';
import {RestController} from "../../com.zippyttech.rest/restController";
import {AnimationsManager} from "../../com.zippyttech.ui/animations/AnimationsManager";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {PermissionModel} from "../permission/permission.model";
import {RoleModel} from "../role/role.model";

declare var SystemJS:any;

@Component({
    moduleId:module.id,
    selector: 'acl',
    templateUrl: 'index.html',
    styleUrls: [ 'style.css'],
    animations: AnimationsManager.getTriggers("d-slide_up|fade-fade",200)
})
export class AclComponent extends RestController implements OnInit{

    public dataSelect:any={};
    public permissions:any={};

    private permissionModel:PermissionModel;
    private roleModel:RoleModel;

    constructor(public db:DependenciesBase) {
        super(db);
    }
    ngOnInit(){
        this.permissionModel = new PermissionModel(this.db);
        this.roleModel = new RoleModel(this.db);

        this.permissions['save']=this.db.myglobal.existsPermission(['ACL_UPDATE']);
        this.permissions['menu']=this.db.myglobal.existsPermission(['MEN_ACL']) ;
    }
    //advertencia
    public modalIn:boolean=true;
    loadPage(event:Event){
        event.preventDefault();
        this.modalIn=false;
        this.loadPermissions();
        this.loadRoles();
    }
    onDashboard(event){
        event.preventDefault();
        let link = ['/init/dashboard', {}];
        this.db.router.navigate(link);
    }

    public dataPermissionsAll:any={};
    loadPermissions(){
        if(this.permissionModel.permissions.list){
            this.permissionModel.rest.max = 1000;
            this.permissionModel.loadData().then((response=>{
                this.permissionsOrder(this.permissionModel.dataList);
            }).bind(this));
        }
    }
    permissionsOrder(data){
        let that=this;
        data.list.forEach(obj=>{
            if(!that.dataPermissionsAll[obj.module])
            {
                that.dataPermissionsAll[obj.module]=[];
            }
            that.dataPermissionsAll[obj.module].push(obj);
        });
    }
    
    //Cargar Roles
    public items:any = [];
    public dataRoles:any=[];
    loadRoles(){
        if(this.roleModel.permissions.list){
            this.roleModel.rest.max = 1000;
            this.roleModel.loadData().then((response=>{
                Object.assign(this.dataRoles, this.roleModel.dataList);
                this.items=[];
                this.dataRoles.list.forEach(obj=>{
                    this.items.push({id:obj.id,text:obj.authority});
                });
            }).bind(this));
        }
    }
    //Cargar Rol Seleccionado
    public role:any=[];
    public setRole(value){
        if(value){
            if(this.role.id!=value){
                this.role=[];
                let index = this.dataRoles.list.findIndex(obj => obj.id == value);
                if(index>-1)
                    Object.assign(this.role,this.dataRoles.list[index]);
            }
        }
    }
    
    public existsPermission(id){
        let index = this.role.permissions.findIndex(obj => obj.id == id);
        if(index > -1)
            return true;
        return false;
    }
    
    getObjectKeys(data={}){
        return Object.keys(data);
    }
    
    
    //Actualizar Permisos
    selectPermission(selectAll){
        let that=this;
        that.role.permissions=[];
        if(selectAll){
            Object.keys(this.dataPermissionsAll).forEach(module=>{
                that.dataPermissionsAll[module].forEach(data=>{
                    that.role.permissions.push({'id':data.id});
                });
            });
        }
    }
    
    //asignar permisos a un rol
    assignPermission(id){
        let index = this.role.permissions.findIndex(obj => obj.id == id);
        if(index > -1)
            this.role.permissions.splice(index,1);
        else
            this.role.permissions.push({'id':id});
    }
    
    existAllPermissionsModule(module):boolean{
        let that=this;
        let assignAll=true;
        this.dataPermissionsAll[module].forEach(data =>{
            let index = that.role.permissions.findIndex(obj => obj.id == data.id);
            if(index < 0)
                return assignAll=false;
        });
        return assignAll;
    }
    assignPermissionModule(module,assign){
        let that=this;
        this.dataPermissionsAll[module].forEach(data =>{
            let index = that.role.permissions.findIndex(obj => obj.id == data.id);
            if(index < 0 && assign)
                this.role.permissions.push({'id':data.id});
            else if (index > -1 && !assign)
                this.role.permissions.splice(index,1);
        });
    }
    
    
    
    
    //Guardar Permisos
    savePermissions(){
        let that =  this;
        if(this.permissions.save){
            let permissions=[];
            this.role.permissions.forEach(obj=>{
                permissions.push(obj.id);
            });
            let body = JSON.stringify({'permissions':permissions});
            let successCallback= response => {
                let index = this.dataRoles.list.findIndex(obj => obj.id == this.role.id);
                this.dataRoles.list[index].permissions = this.role.permissions;
                that.addToast('Notificación','Guardado con exito');
            }
            this.httputils.doPost('/role/'+this.role.id+'/permissions/',body,successCallback,this.error)
        }
    }

}
