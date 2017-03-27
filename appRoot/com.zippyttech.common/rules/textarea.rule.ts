import {IRule} from "./rule";
import {EditableMethods} from "./editable.types";

export interface ITextarea  extends IRule{

}
export class TextareaRule extends EditableMethods{

    constructor(private rule:ITextarea){
        super(rule);
    }
}
