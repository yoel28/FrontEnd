import {IRule, Rule} from "./rule";

interface INumber  extends IRule{
    step?:string;
}
export class NumberRule extends Rule{

    constructor(private rule:INumber){
        super(rule);
    }

    get step():string{
        return this.attributes.step;
    }
    set step(value:string){
        this.attributes.step = value;
    }
}
