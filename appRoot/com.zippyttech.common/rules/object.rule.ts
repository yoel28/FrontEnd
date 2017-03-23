import {IRule, Rule} from "./rule";
import {ModelRoot} from "../modelRoot";

export interface IObject  extends IRule{
    model: ModelRoot;
    update?:boolean;
}
export class ObjectRule extends Rule{

    constructor(private rule:IObject){
        super(rule);
    }

    get title():string{
        return (<IObject>this.rule).model.view.title || 'title default';
    }
    set title(value:string){
        (<IObject>this.rule).model.view.title = value;
    }

    get key():string{
        return (<IObject>this.rule).model.view.key || 'keyDefault';
    }
    set key(value:string){
        (<IObject>this.rule).model.view.key = value;
    }

    get icon():string{
        return (<IObject>this.rule).model.view.icon || 'fa fa-list';
    }
    set icon(value:string){
        (<IObject>this.rule).model.view.icon = value;
    }

    get display():string{
        return (<IObject>this.rule).model.view.display || 'title default';
    }
    set display(value:string){
        (<IObject>this.rule).model.view.display = value;
    }

    get eval():string{
        return (<IObject>this.rule).model.view.eval || null;
    }
    set eval(value:string){
        (<IObject>this.rule).model.view.eval = value;
    }

    get code():string{
        return (<IObject>this.rule).model.view.code || 'codeDefault';
    }
    set code(value:string){
        (<IObject>this.rule).model.view.code = value;
    }

    get permissions():Object{
        return (<IObject>this.rule).model.permissions;
    }
    set permissions(value:Object){
        (<IObject>this.rule).model.permissions = value;
    }

    get mode():'reference'|'checklist'{
        return (<IObject>this.rule).model.view.mode || 'reference';
    }
    set mode(value:'reference'|'checklist'){
        (<IObject>this.rule).model.view.mode = value;
    }






}
