import {Component, OnInit} from '@angular/core';
import {RestController} from "../../com.zippyttech.rest/restController";
import {AnimationsManager} from "../../com.zippyttech.ui/animations/AnimationsManager";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

var jQuery = require('jquery');

@Component({
    selector: 'account-select',
    templateUrl: 'index.html',
    styleUrls: [ 'style.css'],
    animations: AnimationsManager.getTriggers("d-expand_down",200)
})
export class AccountSelectComponent extends RestController implements OnInit{

    constructor(public db:DependenciesBase) {
        super(db);
        this.setEndpoint("/current/account");
    }

    ngOnInit(){
        localStorage.setItem("userTemp","true");
        if(!localStorage.getItem('accountList') && this.db.myglobal.dataSesion.valid){
            localStorage.removeItem('userTemp');
            let link = ['/init/dashboard', {}];
            this.db.router.navigate(link);
        }
        else {
            this.loadData().then(function(response) {
                if(this.dataList.length == 1)
                    this.selectAccount(this.dataList[0]);

                if(this.dataList && this.dataList.length > 1)
                    localStorage.setItem('accountList','true');

            }.bind(this));
            jQuery("main").css("background-color","#222d32");

        }
    }
    selectAccount(data){
        let that = this;
        let body={'newAccount':data.id};
        let successCallback = (response:any) => {
            localStorage.removeItem('userTemp');
            jQuery("main").removeAttr("style");
            that.db.myglobal.dataSesionInit();
            let link = ['/init/dashboard', {}];
            that.db.router.navigate(link);
        };
        this.httputils.doPost('/authenticate', JSON.stringify(body), successCallback, this.error);
    }
    removeChangeAccout(){
        localStorage.removeItem('userTemp');
        let link =['/init/dashboard',{}];
        this.db.router.navigate(link);
    }
    getClassIndex(index){
        let size = this.dataList['length'];
        let row = Math.floor(size / 4);


        let offset = size-(row*4);
        let lg = [3,12,6,4];
        if(index >= row*4){
            return this.db.classCol(lg[offset],lg[offset],lg[offset])
        }
        return this.db.classCol(3,6,6)
    }
}