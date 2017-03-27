import {IRule, Rule} from "./rule";

export interface IPassword extends IRule{
    minLength?:number;
    maxLength?:number;
}
export class PasswordRule extends Rule{

    constructor(public rule:IPassword){
        super(rule);
    }

    get minLength():number{
        return this.attributes.minLength || null;
    }
    set minLength(value:number){
        this.attributes.minLength = value;
    }

    get maxLength():number{
        return this.attributes.maxLength || null;
    }
    set maxLength(value:number){
        this.attributes.maxLength = value;
    }



}
