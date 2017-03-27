import {IRule} from "./rule";
import {IEditable, EditableMethods} from "./editable.types";

type dateOptions = 'date' | 'datetime';
export interface ICombodate  extends IRule,IEditable{
    date:dateOptions;
}

export class CombodateRule extends EditableMethods{

    constructor(private rule:ICombodate){
        super(rule);
    }

    get date():dateOptions{
        return this.attributes.date || 'date';
    }
    set date(value:dateOptions){
        (<ICombodate>this.attributes).date = value;
    }

}
