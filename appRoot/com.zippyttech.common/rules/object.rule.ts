import {IRule, Rule, IIncludeComponents} from "./rule";
import {ModelRoot, modeOptions, IComponents} from "../modelRoot";
import {Actions} from "../../com.zippyttech.init/app/app.types";
import {FormComponent} from "../../com.zippyttech.ui/components/form/form.component";

interface IObjectSource {
    value:number;
    text:string;
}
export interface IObject  extends IRule{
    model: ModelRoot;
    update?:boolean;
    source?:Array<IObjectSource>
}
export class ObjectRule extends Rule{

    constructor(rule:IObject){
        super(rule);
        this._loadActions();
    }
    private _loadActions(){
        this.attributes.actions = new Actions<IIncludeComponents>();
        this.attributes.actions.add('search_save',{
            permission:this.permissions['search'],
            views:[
                {icon:'fa fa-search',title:'Buscar',colorClass:"text-blue"},
                {icon:'fa fa-refresh fa-spin',title:'Buscando..',colorClass:"text-yellow"}
            ],
            callback:(data:FormComponent, key:string) => {
                data.initAction(key,'search');
            },
            stateEval:(data):number=>{
                return this.model.getRest(true).findData?1:0;
            },
            params:{
                save:true
            }
        });
    }

    //region Overwrite methods to access object attributes
    get key():string{
        return (<IObject>this.attributes).model.view.key || 'keyDefault';
    }
    set key(value:string){
        (<IObject>this.attributes).model.view.key = value;
    }

    get icon():string{
        return (<IObject>this.attributes).model.view.icon || 'fa fa-list';
    }
    set icon(value:string){
        (<IObject>this.attributes).model.view.icon = value;
    }

    get display():string{
        return (<IObject>this.attributes).model.view.display || 'title default';
    }
    set display(value:string){
        (<IObject>this.attributes).model.view.display = value;
    }

    get actions():Actions<IIncludeComponents>{
        return this.attributes.actions || null;
    }
    set actions(value:Actions<IIncludeComponents>){
        this.attributes.actions = value;
    }

    //endregion

    //region Access object attributes
    get eval():string{
        return (<IObject>this.attributes).model.view.eval || null;
    }
    set eval(value:string){
        (<IObject>this.attributes).model.view.eval = value;
    }

    get code():string{
        return (<IObject>this.attributes).model.view.code || 'codeDefault';
    }
    set code(value:string){
        (<IObject>this.attributes).model.view.code = value;
    }

    get permissions():Object{
        return (<IObject>this.attributes).model.permissions;
    }
    set permissions(value:Object){
        (<IObject>this.attributes).model.permissions = value;
    }

    get mode():modeOptions{
        return (<IObject>this.attributes).model.view.mode || 'reference';
    }
    set mode(value:modeOptions){
        (<IObject>this.attributes).model.view.mode = value;
    }

    get componentsForm():IComponents{
        if((<IObject>this.attributes).model.view.components && (<IObject>this.attributes).model.view.components.form)
            return (<IObject>this.attributes).model.view.components.form;
        return {};
    }

    //endregion

    get model():ModelRoot{
        return (<IObject>this.attributes).model;
    }
    set model(value:ModelRoot){
        (<IObject>this.attributes).model = value;
    }

    get update():boolean{
        return (<IObject>this.attributes).update;
    }
    set update(value:boolean){
        (<IObject>this.attributes).update = value;
    }


    get source():Array<IObjectSource>{ //TODO:Eliminar y usar data en el objecto
        return this.attributes.source || null;
    }
    set source(value:Array<IObjectSource>){
        this.attributes.source = value;
    }

}
