import {IRule, Rule} from './rule';
import {TagsInput} from '../../com.zippyttech.utils/directive/tagsinput';

export interface IList extends IRule {
    instance?: TagsInput;
    inputFree?: boolean;
}
export class ListRule extends Rule {

    constructor(private rule: IList) {
        super(rule);
    }

    get instance(): TagsInput {
        return this.attributes.instance || null;
    }

    set instance(value: TagsInput) {
        this.attributes.instance = value;
    }

    get inputFree(): boolean {
        return this.attributes.inputFree || false;
    }

    set inputFree(value: boolean) {
        this.attributes.inputFree = value;
    }

}