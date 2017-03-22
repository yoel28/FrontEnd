import {IRule, Rule} from "./rule";

export interface ICombodate  extends IRule{
    date:'date' | 'datetime';
}
export class CombodateRule extends Rule{

    constructor(public rule:ICombodate){
        super(rule);
    }
}
