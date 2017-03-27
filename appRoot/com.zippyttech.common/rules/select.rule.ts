import {IRule, Rule} from "./rule";

interface ISelectSource {
    value:string;
    text:string;
}

export interface ISelect  extends IRule{
    source?:Array<ISelectSource>;
}
export class SelectRule extends Rule{

    constructor(private rule:ISelect){
        super(rule);
    }

    get source():Array<ISelectSource>{
        return this.attributes.source || [];
    }
    set source(value:Array<ISelectSource>){
        this.attributes.source = value;
    }
}