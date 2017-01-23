import {Component, OnInit} from '@angular/core';
import {RestController} from "../../com.zippyttech.rest/restController";
import {AnimationsManager} from "../../com.zippyttech.ui/animations/AnimationsManager";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;

@Component({
    selector: 'acl',
    templateUrl: SystemJS.map.app+'/com.zippyttech.access/acl/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.access/acl/style.css'],
    animations: AnimationsManager.getTriggers("d-slide_up|fade-fade",200)
})
export class AclComponent extends RestController implements OnInit{

    public dataSelect:any={};

    constructor(public db:DependenciesBase) {
        super(db);
    }
    ngOnInit(){

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
        let that=this;
        let successCallback= response => {
            that.permissionsOrder(response.json());
        };
        this.httputils.doGet('/permissions?max=1000',successCallback,this.error)
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
        if(this.db.myglobal.existsPermission(['ROLE_LIST'])){
            let successCallback= response => {
                Object.assign(this.dataRoles, response.json());
                this.items=[];
                this.dataRoles.list.forEach(obj=>{
                    this.items.push({id:obj.id,text:obj.authority});
                });
            };
            this.httputils.doGet('/roles/?max=1000',successCallback,this.error)
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
