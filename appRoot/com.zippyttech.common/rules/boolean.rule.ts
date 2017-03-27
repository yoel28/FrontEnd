import {IRule, Rule} from "./rule";

export interface IBoolean  extends IRule{
    source:Array<ISource>
}

interface ISource{
    value:boolean;
    text:string;
    class?:string;
    icon?:string;
    title:string;
}

export class  BooleanRule extends Rule{

    constructor(private rule:IBoolean){
        super(rule);
    }

    get source():Array<ISource>{
        return (<IBoolean>this.attributes).source || null;
    }
    set source(value:Array<ISource>){
        (<IBoolean>this.attributes).source = value;
    }

}