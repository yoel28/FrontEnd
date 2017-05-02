import {ModelRoot} from "./modelRoot";
import {AccountModel} from "../com.zippyttech.access/account/account.model";
import {DependenciesBase} from "./DependenciesBase";
import {ObjectRule, IObject} from "./rules/object.rule";

export abstract class ModelBase extends ModelRoot{

    constructor(db:DependenciesBase,endpoint:string,useGlobal:boolean=true,prefix?:string) {
        super(db,endpoint,useGlobal,prefix);
        this.checkGlobal();
    }
    private checkGlobal(){
        if(this.permissions['global'])
        {
            this.rules['account'] = new ObjectRule({
                model:new AccountModel(this.db),
                required:true,
                update:this.permissions.update
            }) ;
        }
    }
    public globalOptional(){
        if(this.permissions['global']){
            if(this.rules['account']){
                (<ObjectRule>this.rules['account']).required = false;
                return;
            }
            this.db.debugLog('Error','Optional with global',this.rules)
        }
    }

    public fieldToArray(data:Object,key:string){}

}