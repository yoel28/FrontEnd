import {IRule, Rule} from "./rule";

export interface IColor  extends IRule{
     value?:string,
}
export class ColorRule extends Rule{

    constructor(public rule:IColor){
        super(rule);
    }
}