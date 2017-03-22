import {IRule, Rule} from "./rule";

export interface IText extends IRule{
    email?:boolean;
}
export class TextRule extends Rule{

    constructor(public rule:IText){
        super(rule);
    }
}
