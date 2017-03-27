import {IRule, Rule} from "./rule";
import {ModelRoot} from "../modelRoot";

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
    }

    //region Overwrite methods to access object attributes

    get title():string{
        return (<IObject>this.attributes).model.view.title || 'title default';
    }
    set title(value:string){
        (<IObject>this.attributes).model.view.title = value;
    }

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

    get mode():'reference'|'checklist'{
        return (<IObject>this.attributes).model.view.mode || 'reference';
    }
    set mode(value:'reference'|'checklist'){
        (<IObject>this.attributes).model.view.mode = value;
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
