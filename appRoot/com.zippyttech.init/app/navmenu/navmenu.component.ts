import { Component } from '@angular/core';
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {NavItem, NavStatus} from "./navmenu.types";

@Component({
    moduleId:module.id,
    selector: 'nav-menu',
    templateUrl: 'navmenu.template.html',
    styleUrls: ['navmenu.style.css'],
    inputs:['state']
})
export class NavMenuComponent{
    private menu:NavItem;
    private state:NavStatus;

    constructor(public db:DependenciesBase){
        this.menu = new NavItem(this.db);
        this.state = NavStatus.compact;
        this.loadItems();
    }

    loadItems(){
        this.menu.addNav({
            title:'Dashboard',
            permission: this.db.myglobal.existsPermission(['MEN_DASHBOARD']),
            icon: 'fa fa-dollar',
            routerLink:'init/dashboard'
        });
        this.menu.addNav({
            title:'Acceso',
            permission: this.db.myglobal.existsPermission(['MEN_USER', 'MEN_ACL', 'MEN_PERMISSION', 'MEN_ROLE', 'MEN_ACCOUNT']),
            icon: 'fa fa-gears'
        });
        this.loadItemsAcceso()
        this.menu.addNav({
            title:'Configuración',
            permission: this.db.myglobal.existsPermission(['MEN_EVENT', 'MEN_INFO', 'MEN_PARAM', 'MEN_RULE', 'MEN_NOTIFICATION','MEN_CHANNEL']),
            icon: 'fa fa-gears'
        });
        this.loadItemsConfiguracion();
        console.log(this.menu);
    }
    loadItemsConfiguracion(){
        let ref = this.menu.getItem('Configuración');

        ref.addNav({
            permission: this.db.myglobal.existsPermission(['MEN_CHANNEL']),
            title:'Canales',
            icon: 'fa fa-user',
            routerLink: 'business/channel'
        });
        ref.addNav({
            permission: this.db.myglobal.existsPermission(['MEN_NOTIFICATION']),
            title:'Notificaciones',
            icon: 'fa fa-user',
            routerLink: 'business/notify'
        });
        ref.addNav({
            permission: this.db.myglobal.existsPermission(['MEN_EVENT']),
            title:'Eventos',
            icon: 'fa fa-user',
            routerLink: 'business/event'
        });
        ref.addNav({
            title:'Información',
            permission: this.db.myglobal.existsPermission(['MEN_INFO']),
            icon: 'fa fa-user',
            routerLink: 'business/info'
        });
        ref.addNav({
            title:'Parámetros',
            permission: this.db.myglobal.existsPermission(['MEN_PARAM']),
            icon: 'fa fa-user',
            routerLink: 'business/param'
        });
        ref.addNav({
            title:'Reglas',
            permission: this.db.myglobal.existsPermission(['MEN_RULE']),
            icon: 'fa fa-user',
            routerLink: 'business/rule'
        });
    }
    loadItemsAcceso(){
        let ref = this.menu.getItem('Acceso');
        ref.addNav({
            permission: this.db.myglobal.existsPermission(['MEN_USER']),
            title:'Usuarios',
            icon: 'fa fa-user',
            routerLink: 'access/user'
        });
        ref.addNav({
            permission: this.db.myglobal.existsPermission(['MEN_ACL']),
            title:'ACL',
            icon: 'fa fa-user',
            routerLink: 'access/acl'
        });
        ref.addNav({
            permission: this.db.myglobal.existsPermission(['MEN_PERMISSION']),
            title:'Permisos',
            icon: 'fa fa-user',
            routerLink: 'access/permission'
        });
        ref.addNav({
            permission: this.db.myglobal.existsPermission(['MEN_ROLE']),
            title:'Roles',
            icon: 'fa fa-user',
            routerLink: 'access/role'
        });
        ref.addNav({
            permission: this.db.myglobal.existsPermission(['MEN_ACCOUNT']),
            title:'Cuentas',
            icon: 'fa fa-user',
            routerLink: 'access/account'
        });
    }

    getNavState(){
        return NavStatus[this.state];
    }
}