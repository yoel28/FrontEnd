import {IRule, Rule} from './rule';

type urlOptions = 'image' | 'link';
export interface IUrl extends IRule {
    url?: urlOptions;
}
export class UrlRule extends Rule {

    constructor(private rule: IUrl) {
        super(rule);
    }

    get url(): urlOptions {
        return this.attributes.url || 'link';
    }

    set url(value: urlOptions) {
        this.attributes.url = value;
    }

}