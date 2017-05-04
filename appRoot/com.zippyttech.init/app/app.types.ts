interface IActionView {
    title: string;
    icon: string;
    colorClass?: string;
}

export interface IAction<ParamsType> {
    permission: boolean;
    disabled?: (data: any, key?: string) => boolean;
    views: IActionView[],
    stateEval: ((data: any, key?: string) => number) | string;
    callback: (data?: any, index?: number) => any;
    params?: ParamsType;
    currentView?: (data?) => IActionView;
}

export class Actions<ParamsType> {
    private refs: { [key: string]: IAction<ParamsType> };
    public length: number;
    private _first: IAction<ParamsType>;

    constructor() {
        this.refs = {};
        this.length = 0;
        this._first = null;
    }

    public add(key: string, value: IAction<ParamsType>) {
        value.currentView = (data?) => {
            if (typeof value.stateEval == 'string')
                return value.views[eval(value.stateEval || '0')];
            else
                return value.views[value.stateEval(data)];
        };

        this.refs[key] = value;
        this.length++;

        if (!value.disabled) value.disabled = (): boolean => {
            return false
        };
        if (this.length == 0) this._first = this.refs[key];

    }

    public get(key: string) {
        return this.refs[key] || null;
    }

    public getFirst(data?: any, key?: string): IAction<ParamsType> {
        return (this._first && this._first.disabled(data, key) && this._first.permission) ? this._first : null;
    }

    public toArray(evaluate?: boolean, data?: any, key?: string): IAction<ParamsType>[] {
        let array: IAction<ParamsType>[] = [];
        Object.keys(this.refs).forEach((k) => {
            if (!evaluate || !this.refs[k].disabled(data, key) && this.refs[k].permission)
                array.push(this.refs[k]);
        });
        return array;
    }

    public get getAll() {
        return this.refs;
    }
}

export interface IEnablesMenu {
    tree: boolean;
    modal: boolean;
}