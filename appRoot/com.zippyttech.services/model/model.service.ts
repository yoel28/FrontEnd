import {Injectable} from "@angular/core";
import {ModelRoot} from "../../com.zippyttech.common/modelRoot";
import {modelsDefault,modelsApp} from "../../app-routing.module";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

//@Injectable()
export class ModelService{
    private models:{[key:string]:ModelRoot} = {};
    private constructors:{[key:string]:any} = {};

    constructor(public db:DependenciesBase){
        (modelsDefault.concat(modelsApp)).forEach((constructor)=>{
            let name = constructor.toString();
            this.models[name] = null;
            this.constructors[name] = constructor;
        });
    }

    getModel(name:string){
        if(this.constructors[name]) {
            if (!this.models[name])
                this.models[name] = this.constructors[name](this.db);
            return this.models[name];
        }
        else console.error("Model "+name+" is'n defined in app-routing");
    }
}