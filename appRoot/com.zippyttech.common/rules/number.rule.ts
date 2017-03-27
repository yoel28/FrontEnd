import {IRule} from "./rule";
import {EditableMethods} from "./editable.types";

interface INumber  extends IRule{
    step?:string;
}
export class NumberRule extends EditableMethods{

    constructor(private rule:INumber){
        super(rule);
    }

    get step():string{
        return this.attributes.step;
    }
    set step(value:string){
        this.attributes.step = value;
    }

    get defaultValue():string{
        return this.attributes.defaultValue || '0'
    }
}
