import {IRule, Rule} from "./rule";
import {ModelRoot} from "../modelRoot";

export interface IObject  extends IRule{
    model:ModelRoot,
    update?:boolean
}
export class ObjectRule extends Rule{

    constructor(rule:IObject){
        super(rule);
    }
}
