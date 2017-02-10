import {ModelRoot} from "./modelRoot";
import {AccountModel} from "../com.zippyttech.access/account/account.model";
import {DependenciesBase} from "./DependenciesBase";

export abstract class ModelBase extends ModelRoot{

    constructor(db:DependenciesBase,endpoint:string,useGlobal:boolean=true,prefix?:string) {
        super(db,endpoint,useGlobal,prefix);
        this.checkGlobal();
    }
    private checkGlobal(){
        if(this.permissions['global'])
        {
            let account = new AccountModel(this.db);
            this.rules['account'] =  account.ruleObject;
            this.rules['account'].required = true;
            this.rules['account'].update = this.permissions.update;
        }
    }
    public globalOptional(){
        if(this.permissions['global']){
            this.rules['account'].required = false;
        }
    }

}