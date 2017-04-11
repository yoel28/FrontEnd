import {FormControl} from "@angular/forms";
import {Actions} from "../../com.zippyttech.init/app/app.types";
interface IComponentSave{
    hidden?:string;
    force?:boolean;
    setEqual?:string;
    notReference?:boolean;
    valueChange?:(c:FormControl)=>void;
    validator?:(c:FormControl)=>Object;
}

interface IPermissions{
    search?:boolean;
    update?:boolean;
    visible?:boolean;
}
export interface IIncludeComponents{
    save: boolean,
    filter: boolean,
    list: boolean
}
interface IRefreshField{

}
export interface IRule{
    key?:string;
    protected?:boolean;
    required?:boolean;
    exclude?:boolean;
    icon?:string,
    prefix?:string,
    disabled?:string,
    value?:string,
    check?:boolean,
    readOnly?:boolean,
    minLength?:number;
    maxLength?:number;
    permissions?:IPermissions,
    include?: IIncludeComponents,
    components?:{
        save?:IComponentSave
    }
    actions?:Actions<IIncludeComponents>

}

export class Rule {

    public attributes:any={};

    constructor(data:Object){
        Object.assign(this.attributes,data);
    }

    get key():string{
        return this.attributes.key || 'keyDefault';
    }
    set key(value:string){
        this.attributes.key = value;
    }

    get protected():boolean{
        return this.attributes.protected || false;
    }
    set protected(value:boolean){
        this.attributes.protected = value;
    }

    get required():boolean{
        return this.attributes.required || false;
    }
    set required(value:boolean){
        this.attributes.required = value;
    }

    get exclude():boolean{
        return this.attributes.exclude || false;
    }
    set exclude(value:boolean){
        this.attributes.exclude = value;
    }

    get icon():string{
        return this.attributes.icon || 'fa fa-list';
    }
    set icon(value:string){
        this.attributes.icon = value;
    }

    get prefix():string{
        return this.attributes.prefix || null;
    }
    set prefix(value:string){
        this.attributes.prefix = value;
    }

    get disabled():string{
        return this.attributes.disabled || 'false';
    }
    set disabled(value:string){
        this.attributes.disabled = value;
    }

    get value():string{
        return this.attributes.value;
    }
    set value(value:string){
        this.attributes.value = value;
    }

    get check():boolean{
        return this.attributes.check || false;
    }
    set check(value:boolean){
        this.attributes.check = value;
    }

    get readOnly():boolean{
        return this.attributes.readOnly || false;
    }
    set readOnly(value:boolean){
        this.attributes.readOnly = value;
    }

    get minLength():number{
        return this.attributes.minLength || null;
    }
    set minLength(value:number){
        this.attributes.minLength = value;
    }

    get maxLength():number{
        return this.attributes.maxLength || null;
    }
    set maxLength(value:number){
        this.attributes.maxLength = value;
    }

    get refreshField():Object{
        return this.attributes.refreshField || null;
    }
    set refreshField(value:Object){
        this.attributes.refreshField = value;
    }

    get permissions():IPermissions{
        return this.attributes.permissions || {};
    }
    set permissions(value:IPermissions){
        this.attributes.permissions = value;
    }

    get include():IIncludeComponents{
        return this.attributes.include ||
            {
                save:true,
                filter:true,
                list:true
            };
    }
    set include(value:IIncludeComponents){
        this.attributes.include = value;
    }

    get components():any{
        return this.attributes.components ||
            {
                form:{
                    hidden:'false',
                    force:false
                }
            };
    }
    set components(value:any){
        this.attributes.components = value
    }

    get actions():Actions<IIncludeComponents>{
        return this.attributes.actions || null;
    }
    set actions(value:Actions<IIncludeComponents>){
        this.attributes.actions = value;
    }


    get type():string{
        return this.constructor.name.replace('Rule','').toLowerCase();
    }

    get componentSave():IComponentSave{
        if(this.attributes.components && this.attributes.components.save)
            return this.attributes.components.save;
        return {};
    }



}