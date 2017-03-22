import {IRule, Rule} from "./rule";

interface INumber  extends IRule{
    step?:string;
}
export class NumberRule extends Rule{

    constructor(public rule:INumber){
        super(rule);
    }
}
