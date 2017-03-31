import {Component, OnInit, ChangeDetectorRef, HostListener, DoCheck,ElementRef} from '@angular/core';
import {RestController} from "../../com.zippyttech.rest/restController";
import {RoutesRecognized, NavigationStart} from "@angular/router";
import {contentHeaders} from "../../com.zippyttech.rest/headers";
import {componentsPublic} from "../../app-routing.module";
import {InfoModel} from "../../com.zippyttech.business/info/info.model";
import {AnimationsManager} from "../../com.zippyttech.ui/animations/AnimationsManager";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {AngularFire} from "angularfire2";
import {IModalConfig} from "../../com.zippyttech.services/modal/modal.types";
import {NavStatus} from "./navmenu/navmenu.types";
import {IEnablesMenu} from "./app.types";


declare var SystemJS: any;
@Component({
    moduleId:module.id,
    selector: 'app',
    templateUrl: 'index.html',
    styleUrls: ['style.css'],
    animations: AnimationsManager.getTriggers("d-fade|expand_down", 150)
})
export class AppComponent extends RestController implements OnInit,DoCheck {

    private navMenuState:NavStatus;
    private enablesNavMenus:IEnablesMenu;
    private userDrop:boolean = false;

    public info:InfoModel;


    constructor(public db: DependenciesBase, private cdRef: ChangeDetectorRef,public af: AngularFire, private el:ElementRef) {
        super(db);
        this.routerEvents();
        let url="https://cdg.zippyttech.com:8080";
        localStorage.setItem('urlAPI', url + '/api');
        localStorage.setItem('url', url);
        this.navMenuState = NavStatus.compact;
    }

    ngOnInit(): void {
        this.db.$elements.app = this.el.nativeElement;
        this.loadPublicData();

        // if(this.validToken()  && !this.db.myglobal.dataSesion.valid){
        //      this.goPage(null,'/init/load');
        // }
    }

    routerEvents(){
        let that = this;
        this.db.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                that.db.myglobal.navigationStart = true;
            }
            if (event instanceof RoutesRecognized) {
                that.db.myglobal.navigationStart = false;
                let componentName = event.state.root.children[0].component['name'];
                let isPublic = that.isPublic(componentName);

                if (isPublic && localStorage.getItem('bearer')) {
                    let link = ['/init/dashboard', {}];
                    if(componentName == 'TermConditionsComponent'){
                        //jQuery('#termConditions').modal('show'); TODO:MODAL TERMINOS
                    }
                    that.db.router.navigate(link);
                }
                else if (localStorage.getItem('userTemp')){
                    if(componentName!='AccountSelectComponent'){
                        if(componentName!='LoadComponent')
                            that.db.myglobal.saveUrl = event.url;
                        let link = ['/auth/accountSelect', {}];
                        that.db.router.navigate(link);
                    }
                }
                else if (!isPublic && !that.db.myglobal.dataSesion.valid ) {
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

                if (that.db.myglobal.dataSesion.valid  && that.db.myglobal.getParams('VERSION_CACHE') != localStorage.getItem('VERSION_CACHE')) {
                    if(!localStorage.getItem('userTemp'))
                    {
                        localStorage.setItem('VERSION_CACHE', that.db.myglobal.getParams('VERSION_CACHE'));
                        location.reload(true);
                    }
                }
            }
        });
    }

    initModels() {
        this.info = new InfoModel(this.db);
        this.info.rules['code'].readOnly = true;
        this.info.paramsSave.updateField = true;
    }

    ngDoCheck() {
        this.cdRef.detectChanges();
    }

    public get sessionValid(){
        if(this.db.myglobal.dataSesion.valid && !localStorage.getItem('userTemp')){
            this.loadPage();
            return true;
        }
        return false;
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
            localStorage.removeItem('userTemp');
            localStorage.removeItem('accountList');
            contentHeaders.delete('Authorization');
            that.af.auth.logout();
            let link = ['/auth/login', {}];
            that.db.router.navigate(link);
        };
        this.httputils.doPost('/logout', null, successCallback, this.error);

    }

    public changeAccount(event){
        if(event)
            event.preventDefault();

        localStorage.setItem('userTemp','true');

        let link = ['/auth/accountSelect', {}];
        this.db.router.navigate(link);

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

    loadPage() {
        this.initModels();
        this.enablesNavMenus = {
            tree: (this.db.myglobal.getParams('MENU_LIST') == 'true'),
            modal: (this.db.myglobal.getParams('MENU_MODAL')=='true')
        };
    }

    getLocalStorage(item){
        return localStorage.getItem(item);
    }

    setInstance(instance, prefix) {
        if (!this.db.myglobal.objectInstance[prefix])
            this.db.myglobal.objectInstance[prefix] = {};
        this.db.myglobal.objectInstance[prefix] = instance;
    }

    loadPublicData(){
        let that = this;
        let callback=(response)=>{
            Object.assign(that.db.myglobal.publicData,response.json());
        };
        this.httputils.doGet(localStorage.getItem('url'),callback,this.error,true)
    }

    getIModalTerm(){
        let iModalTerm:IModalConfig = {
            id:'termConditions',
            size:'lg',
            header:{
                title:'Terminos y condiciones'
            }
        };
        return iModalTerm;
    }
    @HostListener('window:offline') offline() {
        this.addToast('Offline','Se a detectado un problema con el Internet, Por favor conectarse a la red','error');
    }

    toggleTreeMenu(){
        this.navMenuState = (this.navMenuState == NavStatus.compact)?NavStatus.expand:NavStatus.compact;
    }
    toggleModalMenu(){}


    getNavState(){
        return NavStatus[this.navMenuState];
    }
}
