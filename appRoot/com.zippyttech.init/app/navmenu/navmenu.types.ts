import {DependenciesBase} from '../../../com.zippyttech.common/DependenciesBase';

export enum NavStatus{ hidden = 0, compact, expand }
;

interface INavParams {
    permission: boolean;
    routerLink?: string;
    title?: string;
    icon?: string;
    order?: number;
    items?: NavItem[];
    click?: () => void;
}

export class NavItem {
    private params: INavParams;
    private indexOf: { [title: string]: number };
    private selectedItem: number = -1;

    constructor(public db: DependenciesBase, params?: INavParams) {
        this.params = params || {permission: true};
        this.params.items = [];
        this.indexOf = {};
    }

    public addNav(params: INavParams) {
        this.indexOf[params.title] = this.items.length;
        this.items.push(new NavItem(this.db, params));
    }

    public getItem(title: string): NavItem {
        return this.items[this.indexOf[title]];
    }

    public get items() {
        return this.params.items;
    }

    public get title() {
        return this.params.title;
    }

    public get icon() {
        return this.params.icon;
    }

    public get permission() {
        return this.params.permission;
    }

    public get routerLink() {
        return this.params.routerLink;
    }

    public click(itemSelect: number) {
        this.selectedItem = (this.selectedItem != itemSelect && this.items[itemSelect].items.length > 0) ? itemSelect : -1;

        if (this.items[itemSelect].routerLink)
            this.db.goPage(this.items[itemSelect].routerLink);
        if (this.params.click)
            this.params.click();
    }
}
