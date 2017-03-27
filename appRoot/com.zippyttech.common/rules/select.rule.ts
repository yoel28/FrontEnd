import {Rule} from "./rule";
import {EditableMethods} from "./editable.types";

interface ISelectSource {
    value:string;
    text:string;
}

export interface ISelect  extends EditableMethods{
    source?:Array<ISelectSource>;
}
export class SelectRule extends Rule{

    constructor(private rule:ISelect){
        super(rule);
    }

    get source():Array<ISelectSource>{
        return this.attributes.source || null;
    }
    set source(value:Array<ISelectSource>){
        this.attributes.source = value;
    }
}