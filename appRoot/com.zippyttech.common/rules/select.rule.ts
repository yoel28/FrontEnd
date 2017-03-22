import {IRule, Rule} from "./rule";

interface ISelectSource {
    value:string;
    text:string;
}

interface ISelect  extends IRule{
    source?:Array<ISelectSource>;
}
export class SelectRule extends Rule{

    constructor(public rule:ISelect){
        super(rule);
    }
}