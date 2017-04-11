import {ModelRoot, IView} from "../../com.zippyttech.common/modelRoot";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {ImageRule} from "../../com.zippyttech.common/rules/image.rule";
import {TextRule} from "../../com.zippyttech.common/rules/text.rule";
import {SelectRule} from "../../com.zippyttech.common/rules/select.rule";

export class NotificationModel extends ModelRoot{

    constructor(public db:DependenciesBase){
        super(db,'/notifications/');
        this.initModel();
    }
    modelExternal() {}
    initModelActions(){}
    initPermissions() {}
    initDataActions(){}

    initView(params:IView){
        params.display = this.nameClass+"Title";
    }

    initRules(){

        this.rules['image']= new ImageRule({
            permissions: {
                update: this.permissions.update,
                visible: this.permissions.visible,
            },
            include:{
                save:false,
                filter:false,
                list:true
            },
            key: 'image',
        });

        this.rules['title']=new TextRule({
           permissions: {
               update: this.permissions.update,
               visible: this.permissions.visible,
               search: this.permissions.filter,
           },
            key: 'title'
        });

        this.rules['icon']= new SelectRule({
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            }, source: [
                {value: 'fa fa-question-circle',    text: 'Icono 1'},
                {value: 'fa fa-question',           text: 'Icono 2'},
            ],
            key: 'icon'
        });

        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }



}