import {Editable, IEditable} from "./editable.types";
import {API} from "../../com.zippyttech.utils/catalog/defaultAPI";

export interface ITextarea  extends IEditable{
    rows?:number;
}
export class TextareaRule extends Editable{

    constructor(private rule:ITextarea){
        super(rule);
    }

    set rows(value:number){
        this.attributes.rows = value;
    }
    get rows():number{
        return this.attributes.rows || API.TEXTAREA_ROWS
    }
}
