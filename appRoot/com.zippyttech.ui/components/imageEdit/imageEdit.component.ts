import {Component, EventEmitter, NgModule} from '@angular/core';
import {XCropit} from "../../../com.zippyttech.utils/directive/xCropit";
import {XFile} from "../../../com.zippyttech.utils/directive/xFile";
import {StaticValues} from "../../../com.zippyttech.utils/catalog/staticValues";

declare var SystemJS:any;
declare var moment:any;
@NgModule({
    imports:[XCropit,XFile],
})
@Component({
    selector: 'image-edit-view',
    templateUrl: SystemJS.map.app+'/com.zippyttech.ui/components/imageEdit/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.ui/components/imageEdit/style.css'],
    inputs:['params','image','default','edit'],
    outputs:['out'],
})
export class ImageEditComponent {

    public configId=moment().valueOf();
    public out:any;
    public pathElements=StaticValues.pathElements;
    public edit:boolean = true;

    public params:any={};

    public image:string="";
    public default:string="";

    constructor() {
        this.out = new EventEmitter();
    }
    ngOnInit(){

    }
    saveImage(data){
        this.out.emit(this.image);
    }
    changeImage(data=null){
        this.image=data;
    }
}