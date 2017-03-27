import {Editable, IEditable} from "./editable.types";

export interface ITextarea  extends IEditable{

}
export class TextareaRule extends Editable{

    constructor(private rule:ITextarea){
        super(rule);
    }
}
