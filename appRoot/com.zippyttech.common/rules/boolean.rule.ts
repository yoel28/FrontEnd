import {IRule, Rule} from "./rule";



export interface IBoolean  extends IRule{
    source:Array<ISource>
}
interface ISource{
    value:boolean;
    text:string;
    class:string;
    icon:string;
    title:string;
}

export class  BooleanRule extends Rule{

    constructor(private rule:IBoolean){
        super(rule);
    }

    get source():Array<ISource>{
        return this.attributes.source || [];
    }
    set source(value:Array<ISource>){
        this.attributes.source = value;
    }

}