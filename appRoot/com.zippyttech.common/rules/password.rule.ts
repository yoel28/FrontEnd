import {IRule} from "./rule";
import {EditableMethods} from "./editable.types";

export interface IPassword extends IRule{

}
export class PasswordRule extends EditableMethods{

    constructor(public rule:IPassword){
        super(rule);
    }

}
