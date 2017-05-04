import {Editable, IEditable} from './editable.types';

type dateOptions = 'date' | 'datetime';
export interface ICombodate extends IEditable {
    date: dateOptions;
    format?: string;
    viewformat?: string;
    template?: string;
    minYear?: number;
    maxYear?: number;
}

export class CombodateRule extends Editable {

    constructor(private rule: ICombodate) {
        super(rule);
    }

    get date(): dateOptions {
        return this.attributes.date || 'date';
    }

    set date(value: dateOptions) {
        (<ICombodate>this.attributes).date = value;
    }

    get format(): string {
        return this.attributes.format;
    }

    set format(value: string) {
        (<ICombodate>this.attributes).format = value;
    }

    get viewformat(): string {
        return this.attributes.viewformat;
    }

    set viewformat(value: string) {
        (<ICombodate>this.attributes).viewformat = value;
    }

    get template(): string {
        return this.attributes.template;
    }

    set template(value: string) {
        (<ICombodate>this.attributes).template = value;
    }

    get minYear(): number {
        return this.attributes.minYear;
    }

    set minYear(value: number) {
        (<ICombodate>this.attributes).minYear = value;
    }

    get maxYear(): number {
        return this.attributes.maxYear;
    }

    set maxYear(value: number) {
        (<ICombodate>this.attributes).maxYear = value;
    }

}
