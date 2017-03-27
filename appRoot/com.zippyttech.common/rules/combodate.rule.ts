import {IRule} from "./rule";
import {IEditable, EditableMethods} from "./editable.types";


export interface ICombodate  extends IRule,IEditable{
    date:'date' | 'datetime';
}

export class CombodateRule extends EditableMethods{

    constructor(private rule:ICombodate){
        super(rule);
    }

    get date():'date' | 'datetime'{
        return this.attributes.date || 'date';
    }
    set date(value:'date' | 'datetime'){ //TODO: validar tipos de date
        (<ICombodate>this.attributes).date = value;
    }

}
