import {IRule, Rule} from './rule';
import {StaticValues} from '../../com.zippyttech.utils/catalog/staticValues';

export interface IImage extends IRule {
    default?: string;
}
export class ImageRule extends Rule {

    constructor(private rule: IImage) {
        super(rule);
    }

    get default(): string {
        return this.attributes.default || StaticValues.pathElements.robot;
    }

    set default(value: string) {
        this.attributes.default = value;
    }

}
