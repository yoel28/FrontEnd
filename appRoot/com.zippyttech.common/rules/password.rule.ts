import {Editable, IEditable} from "./editable.types";

export interface IPassword extends IEditable{

}
export class PasswordRule extends Editable{

    constructor(public rule:IPassword){
        super(rule);
    }

    get value():string{
        return '*****'
    }
    get defaultValue():string{
        return '*****'
    }

}
