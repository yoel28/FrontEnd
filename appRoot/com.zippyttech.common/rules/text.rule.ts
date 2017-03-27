import {IRule, Rule} from "./rule";

export interface IText extends IRule{
    email?:boolean;
}
export class TextRule extends Rule{

    constructor(private rule:IText){
        super(rule);
    }

    set email(value:boolean){
        this.attributes.email = value;
    }
    get email():boolean{
        return this.attributes.email;
    }
}
