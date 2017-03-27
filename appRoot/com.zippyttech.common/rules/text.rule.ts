import {IRule} from "./rule";
import {EditableMethods} from "./editable.types";

export interface IText extends IRule{
    email?:boolean;
}
export class TextRule extends EditableMethods{

    constructor(private rule:IText){
        super(rule);
    }

    set email(value:boolean){
        this.attributes.email = value;
    }
    get email():boolean{
        return this.attributes.email || false;
    }
}
