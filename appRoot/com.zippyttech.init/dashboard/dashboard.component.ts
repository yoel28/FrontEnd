import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {ModalService} from "../../com.zippyttech.services/modal/modal.service";
import {UserModel} from "../../com.zippyttech.access/user/user.model";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {ModalParams, IModalDelete, IModalSave} from "../../com.zippyttech.services/modal/modal.types";

declare var SystemJS:any;

@Component({
    moduleId:module.id,
    selector: 'dashboard',
    templateUrl: 'index.html',
    styleUrls: ['style.css']
})
export class DashboardComponent implements OnInit{
    userModel:any = {};
    modals:{name:string, params:ModalParams}[] = [];

    constructor(public db:DependenciesBase,public http:Http,private ms:ModalService) {
    }

    ngOnInit():void{
        this.userModel = new UserModel(this.db);
        this.userModel.loadData().then((()=> {
            this.modals.push({
                    name: 'delete',
                    params:{ model: this.userModel, selectedData: this.userModel.dataList.list[0]}
                },{
                    name: 'save',
                    params:{ model: this.userModel, afterRunning:()=>{alert("exit");}}
                }
            );
        }).bind(this));
    }

    public getObjectKeys(data):string[] {
        return Object.keys(data || {});
    }

}


