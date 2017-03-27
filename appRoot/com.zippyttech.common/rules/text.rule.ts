import {Editable, IEditable} from "./editable.types";

export interface IText extends IEditable{
    email?:boolean;
}
export class TextRule extends Editable{

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
