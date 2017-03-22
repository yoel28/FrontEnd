import {IRule, Rule} from "./rule";

export interface ITextarea  extends IRule{

}
export class TextareaRule extends Rule{

    constructor(public rule:ITextarea){
        super(rule);
    }
}
