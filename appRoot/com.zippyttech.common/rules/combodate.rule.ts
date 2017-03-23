import {IRule, Rule} from "./rule";

export interface ICombodate  extends IRule{
    date:'date' | 'datetime';
}
export class CombodateRule extends Rule{

    constructor(private rule:ICombodate){
        super(rule);
    }

    get date():string{
        return this.attributes.date || 'date';
    }
    set date(value:string){ //TODO: eval value in date or datetime
        this.attributes.date = value;
    }

}
