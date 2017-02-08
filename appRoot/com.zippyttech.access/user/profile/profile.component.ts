import {Component, OnInit} from '@angular/core';
import {ControllerBase} from "../../../com.zippyttech.common/ControllerBase";
import {UserModel} from "../user.model";
import {AnimationsManager} from "../../../com.zippyttech.ui/animations/AnimationsManager";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";

declare var SystemJS:any;

@Component({
    selector: 'user-profile',
    templateUrl: SystemJS.map.app+'/com.zippyttech.access/user/profile/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.access/user/profile/style.css'],
    animations: AnimationsManager.getTriggers("d-slide_up|fade-fade",200)
})
export class ProfileComponent extends ControllerBase implements OnInit{

    constructor(public db:DependenciesBase) {
        super(db);
    }
    ngOnInit():any
    {
        super.ngOnInit();
        this.loadPage();
    }
    initModel():any{
        this.model = new UserModel(this.db);
    }

    saveImage(data){
        this.model.onPatchProfile('image',this.db.myglobal.user,data);
    }

}