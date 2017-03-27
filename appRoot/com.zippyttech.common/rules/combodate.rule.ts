import {IEditable, Editable} from "./editable.types";

type dateOptions = 'date' | 'datetime';
export interface ICombodate  extends IEditable{
    date:dateOptions;
}

export class CombodateRule extends Editable{

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
