//type:'text'|'number'|'date'|'list'|'boolean'|'image'|'location';
export interface IRule{
    key?:string;
    title?:string;
    protected?:boolean;
    placeholder?:string;
    required?:boolean;
    exclude?:boolean;
    icon?:string,
    prefix?:string,
    disabled?:string,
    showbuttons?:boolean,
    check?:boolean,
    readOnly?:boolean,
    refreshField?:{

    }
    permissions?:{
        search?:boolean;
        update?:boolean;
        visible?:boolean;
    }
    include?: {
        save: boolean,
        filter: boolean,
        list: boolean
    },
    components?:{
        form?:{
            hidden:string
        }
    }

}

export class Rule {

    private _default:IRule={
        key:'default',
        title:'Título',
        protected:false,
        placeholder:'placeholder',
        required:false,
        exclude:false,
        icon: 'fa fa-list',
        disabled:'false',
        showbuttons:false,
        check:false,
        readOnly:false,
        permissions:{
            search:false,
            update:false,
            visible:false,
        },
        include:{
            save:true,
            filter:true,
            list:true
        },
        components:{
            form:{
                hidden:'false'
            }
        }
    };
    constructor(data:Object){
        this.attributes = data;
    }
    set attributes(data:Object){
        Object.assign(this,this._default,data);
    }


}