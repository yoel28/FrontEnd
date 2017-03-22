interface IActionView{
    title: string;
    icon: string;
    colorClass?: string;
}

export interface IAction<ParamsType>{
    permission: boolean;
    disabled?:string;
    views:IActionView[],
    stateEval:string;
    callback: (data?: any, index?: number) => any;
    params?: ParamsType;
    currentView?:(data?)=>IActionView;
}

export class Actions<ParamsType>{
    private refs:{[key:string]:IAction<ParamsType>};
    public length:number;
    private _first:IAction<ParamsType>;

    constructor(){
        this.refs = {};
        this.length = 0;
        this._first=null;
    }

    public add(key:string,value:IAction<ParamsType>){
        value.currentView = (data?)=>{ return value.views[eval(value.stateEval || '0')] };

        this.refs[key] = value;
        this.length++;

        if(this.length==0) this._first = this.refs[key];
    }

    public get(key:string){
        return this.refs[key] || null;
    }

    public getFirst(data?):IAction<ParamsType>{
        return (this._first && eval(this._first.disabled) && this._first.permission)?this._first:null;
    }

    public toArray(evaluate?:boolean, data?):IAction<ParamsType>[]{
        let array:IAction<ParamsType>[]=[];
        Object.keys(this.refs).forEach((k)=>{
            if(!evaluate || (!eval(this.refs[k].disabled) && this.refs[k].permission))
                array.push(this.refs[k]);
        });
        return array;
    }
}