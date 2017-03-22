import {IRule, Rule} from "./rule";

export interface IImage  extends IRule{
    default?:string;
}
export class ImageRule extends Rule{

    constructor(public rule:IImage){
        super(rule);
    }
}
