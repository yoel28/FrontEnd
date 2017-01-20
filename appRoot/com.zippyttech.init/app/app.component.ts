import {Component, OnInit, ChangeDetectorRef, AfterViewInit, AfterContentChecked, HostListener, DoCheck } from '@angular/core';
import {RestController} from "../../com.zippyttech.rest/restController";
import {RoutesRecognized, NavigationStart} from "@angular/router";
import {contentHeaders} from "../../com.zippyttech.rest/headers";
import {FormControl} from "@angular/forms";
import {componentsPublic} from "../../app-routing.module";
import {InfoModel} from "../../com.zippyttech.business/info/info.model";
import {AnimationsManager} from "../../com.zippyttech.ui/animations/AnimationsManager";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {AngularFire} from "angularfire2";
import {IModal} from "../../com.zippyttech.ui/components/modal/modal.component";

declare var jQuery: any;
declare var SystemJS: any;
@Component({
    selector: 'my-app',
    templateUrl: SystemJS.map.app + 'com.zippyttech.init/app/index.html',
    styleUrls: [SystemJS.map.app + 'com.zippyttech.init/app/style.css'],
    animations: AnimationsManager.getTriggers("d-fade|expand_down", 150)
})
export class AppComponent extends RestController implements OnInit,AfterViewInit,AfterContentChecked,DoCheck {

    public menuType: FormControl;
    public menuItems: FormControl;

    public activeMenuId: string;

    public info: any;

    constructor(public db: DependenciesBase, private cdRef: ChangeDetectorRef,public af: AngularFire) {
        super(db);

        let that = this;
        let url = "https://cdg.zippyttech.com:8080";

        localStorage.setItem('urlAPI', url + '/api');
        localStorage.setItem('url', url);

        db.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                that.db.myglobal.navigationStart = true;
            }
            if (event instanceof RoutesRecognized) {
                that.db.myglobal.navigationStart = false;
                let componentName = event.state.root.children[0].component['name'];
                let isPublic = that.isPublic(componentName);

                if (isPublic && that.db.myglobal.dataSesion.valid) {
                    let link = ['/init/dashboard', {}];
                    that.db.router.navigate(link);
                }
                else if (!isPublic && !that.db.myglobal.dataSesion.valid) {
                    let link: any;
                    if (localStorage.getItem('bearer')) {
                        if (componentName != 'LoadComponent') {
                            that.db.myglobal.saveUrl = event.url;
                            link = ['/init/load', {}];
                            that.db.router.navigate(link);
                        }
                    }
                    else {
                        that.db.myglobal.saveUrl = event.url;
                        link = ['/auth/login', {}];
                        that.db.router.navigate(link);
                    }
                }
                else if (that.db.myglobal.saveUrl && !isPublic) {
                    let link = [that.db.myglobal.saveUrl, {}];
                    that.db.myglobal.saveUrl = null;
                    that.db.router.navigate(link);
                }

                if (that.db.myglobal.dataSesion.valid && that.db.myglobal.getParams('VERSION_CACHE') != localStorage.getItem('VERSION_CACHE')) {
                    localStorage.setItem('VERSION_CACHE', that.db.myglobal.getParams('VERSION_CACHE'));
                    location.reload(true);
                }
            }
        });
    }

    ngOnInit(): void {
        this.menuType = new FormControl(null);
        this.menuItems = new FormControl([]);
        this.loadPublicData();
    }

    initModels() {
        this.info = new InfoModel(this.db);
        this.info.rules['code'].readOnly = true;
        this.info.paramsSave.updateField = true;
    }

    public ngAfterViewInit() {

    }

    ngDoCheck() {
        this.cdRef.detectChanges();
    }

    ngAfterContentChecked() {

    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        //TODO:Cambiar menu
        this.db.myglobal.visualData.height = event.target.innerWidth;
    }

    public isPublic(component: string) {
        return componentsPublic.indexOf(component) > -1 ? true : false;
    }

    public validToken(): boolean {
        return localStorage.getItem('bearer') ? true : false;
    }

    logout(event: Event) {
        event.preventDefault();
        let that = this;
        let successCallback = (response: any) => {
            this.db.myglobal.dataSesionInit();
            localStorage.removeItem('bearer');
            contentHeaders.delete('Authorization');
            that.af.auth.logout();
            this.menuItems.setValue([]);
            this.menuType.setValue(null);
            this.activeMenuId = "";
            let link = ['/auth/login', {}];
            that.db.router.navigate(link);
        };
        this.httputils.doPost('/logout', null, successCallback, this.error);

    }

    public replace(data: string): string {
        return data.replace(/;/g, ' ');
    }

    onProfile(event?: Event): void {
        if (event)
            event.preventDefault();
        let link = ['/access/user/profile', {}];
        this.db.router.navigate(link);

    }

    activeMenu(event, id) {

        this.menuItems.value.forEach((v) => {
            if (this.activeMenuId === v.key && this.activeMenuId !== id)
                v.select = false;

            if (id === v.key)
                v.select = !v.select;
        });

        if (event)
            event.preventDefault();

        if (this.activeMenuId == id) {
            this.activeMenuId = "";
        }
        else {
            this.activeMenuId = id;
        }

    }

    loadPage() {
        if (!this.menuType.value) {
            this.loadMenu();
            this.initModels();
            this.menuType.setValue({
                'list': this.db.myglobal.getParams('MENU_LIST') == '1' ? true : false,
                'modal': this.db.myglobal.getParams('MENU_MODAL') == '1' ? true : false,
            });

            if (!this.menuType.value.list) {
                jQuery('body').addClass('no-menu');
            }
        }
    }

    loadMenu() {
        if (this.menuItems.value && this.menuItems.value.length == 0) {

            this.menuItems.value.push({
                'visible': this.db.myglobal.existsPermission(['MEN_DASHBOARD']),
                'icon': 'fa fa-dollar',
                'title': 'Dashboard',
                'routerLink': '/init/dashboard'

            });
            this.menuItems.value.push({
                'visible': this.db.myglobal.existsPermission(['MEN_USERS', 'MEN_ACL', 'MEN_PERM', 'MEN_ROLE', 'MEN_ACCOUNT']),
                'icon': 'fa fa-gears',
                'title': 'Acceso',
                'key': 'Acceso',
                'select': false,
                'treeview': [
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_USERS']),
                        'icon': 'fa fa-user',
                        'title': 'Usuarios',
                        'routerLink': '/access/user'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_ACL']),
                        'icon': 'fa fa-user',
                        'title': 'ACL',
                        'routerLink': '/access/acl'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_PERM']),
                        'icon': 'fa fa-user',
                        'title': 'Permisos',
                        'routerLink': '/access/permission'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_ROLE']),
                        'icon': 'fa fa-user',
                        'title': 'Roles',
                        'routerLink': '/access/role'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_ACCOUNT']),
                        'icon': 'fa fa-building',
                        'title': 'Cuentas',
                        'routerLink': '/access/account'
                    },
                ]
            });
            this.menuItems.value.push({
                'visible': this.db.myglobal.existsPermission(['MEN_EVENT', 'MEN_INFO', 'MEN_PARAM', 'MEN_RULE', 'MEN_NOTIFY']),
                'icon': 'fa fa-gears',
                'title': 'Configuración',
                'key': 'Configuracion',
                'select': false,
                'treeview': [
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_EVENT']),
                        'icon': 'fa fa-user',
                        'title': 'Eventos',
                        'routerLink': '/business/event'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_INFO']),
                        'icon': 'fa fa-user',
                        'title': 'Información',
                        'routerLink': '/business/info'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_PARAM']),
                        'icon': 'fa fa-user',
                        'title': 'Parámetros',
                        'routerLink': '/business/param'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_RULE']),
                        'icon': 'fa fa-user',
                        'title': 'Reglas',
                        'routerLink': '/business/rule'
                    },
                ]
            });
        }
    }

    menuItemsVisible(menu) {
        let data = [];
        menu.forEach(obj => {
            if (obj.visible)
                data.push(obj)
        });
        return data;
    }

    menuItemsTreeview(menu) {
        let data = [];
        let datatemp = [];
        menu.forEach(obj => {
            if (obj.treeview)
                data.push(obj);
            else
                datatemp.push(obj);
        });
        data.unshift({'icon': 'fa fa-gears', 'title': 'General', 'key': 'General', 'treeview': datatemp});
        return data;
    }

    setInstance(instance, prefix) {
        if (!this.db.myglobal.objectInstance[prefix])
            this.db.myglobal.objectInstance[prefix] = {};
        this.db.myglobal.objectInstance[prefix] = instance;
    }

    goPage(event, url) {
        if (event)
            event.preventDefault();
        let link = [url, {}];
        this.db.router.navigate(link);
    }

    loadPublicData(){
        let that = this;
        let callback=(response)=>{
            Object.assign(that.db.myglobal.publicData,response.json());
        };
        this.httputils.doGet(localStorage.getItem('url'),callback,this.error,true)
    }

    getIModalTerm(){
        let iModalTerm:IModal = {
            id:'termConditions',
            header:{
                title:'Terminos y condiciones'
            }
        };
        return iModalTerm;
    }
}
