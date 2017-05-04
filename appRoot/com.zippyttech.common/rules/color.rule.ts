import {IRule, Rule} from './rule';

export interface IColor extends IRule {
}
export class ColorRule extends Rule {

    constructor(private rule: IColor) {
        super(rule);
    }

    get value(): string {
        return this.attributes.value || '#FFFFFF'
    }

}