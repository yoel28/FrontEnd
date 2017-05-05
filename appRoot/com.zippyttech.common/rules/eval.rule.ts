import {IRule, Rule} from './rule';
import {DependenciesBase} from "../DependenciesBase";

export interface IEval extends IRule {
    expression:string;
    db:DependenciesBase;
}

export class EvalRule extends Rule {

    constructor(private rule: IEval) {
        super(rule);
    }

    getValue(data:Object):string{
        return this.db.evalMe(data,this.expression)
    }

    get expression(): string {
        return this.expression || '';
    }

    set expression(value: string) {
        this.expression = value;
    }

    get db(): DependenciesBase {
        return (<IEval>this.attributes).db;
    }

    set db(value: DependenciesBase) {
        (<IEval>this.attributes).db = value;
    }

}