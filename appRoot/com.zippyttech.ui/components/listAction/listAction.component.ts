import {Component, EventEmitter, OnInit, Input} from "@angular/core";
import {ControllerBase} from "../../../com.zippyttech.common/ControllerBase";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
import {AnimationsManager} from "../../animations/AnimationsManager";
import {FormComponent} from "../form/form.component";
import {FormControl} from "@angular/forms";

declare var SystemJS:any;
declare var moment:any;
declare var jQuery:any;


export interface IListActionData {
    actions: IAction;
    globalParams:IActionParams;
    model: any;
    routerLink: string;
    observable?:{
        watch:FormControl,
        _function:(context:ListActionComponent)=>void;
    }
}

interface IActionParams {
    [name:string]:{
        required: boolean,
        value?: string | boolean | number
    };
}

interface IAction {
    [name:string]:{
        title:string;
        action: (context:ListActionComponent)=>void,
        permission: boolean,
        params?:IActionParams,
        model?:any,
    };
}

@Component({
    moduleId: module.id,
    selector: 'list-action',
    templateUrl: 'template.html',
    styleUrls: ['style.css'],
    inputs:['data'],
    animations: AnimationsManager.getTriggers("d-expand_down|fade",200)
})
export class ListActionComponent extends ControllerBase
{
    public data:IListActionData;
    private visibleKeys:string[] = [];

    private instanceForm:FormComponent;

    public actionSelect:string = "";
    public dataForm:Object={};
    public dataSelect:any = {};


    constructor(public db:DependenciesBase) {
        super(db);
        this.setEndpoint(this.model.endpoint);
        this.prefix = this.model.prefix;
    }

    ngOnInit()
    {
        super.ngOnInit();
        let that = this;
        if(this.data.observable && this.data.observable.watch){
            this.data.observable.watch.valueChanges.subscribe(
                (value) => {
                    that.data.observable._function(that);
                }
            )
        }

    }

    public getVisibleDataKeys()
    {
        let data=[];
        let that=this;
        Object.keys(this.data.model.rules).forEach((key)=>{
            if(that.data.model.rules[key].visible)
                data.push(key)
        });
        return data;
    }

    initModel()
    {
        this.visibleKeys = this.getVisibleDataKeys();

    }

    private getActionKeys(actions:IAction):string[]
    {
        let keys:string[] = [];
        Object.keys(actions).forEach(k=>{
            if(actions[k].permission)
                keys.push(k);
        })
        return keys;
    }

    private filterRules(key:string)
    {
        let that = this;
        let oldRules = this.getModelAction(key).rulesSave;
        let params = that.getParamsAction(key);
        let newRules = {};
        Object.keys(params).forEach(k=> {
            if (oldRules[k]){
                newRules[k] = oldRules[k];
                newRules[k].required = params[k].required;
            }
            else{
                console.log("not found rule: "+k);
            }
        })
        return newRules;
    }

    private setForm(form){
        this.instanceForm=form
    }

    public submit(event,key:string)
    {
        if(event)
            event.preventDefault();
        if(key && this.data.actions[key])
        {
            let that = this;
            this.dataForm = this.instanceForm.getFormValues();
            this.data.actions[key].action(this);
        }
    }

    private getModelAction(key:string){
        if(key && this.data.actions[key])
            return this.data.actions[key].model || this.data.model;
        return {};
    }

    private getParamsAction(key:string){
        if(key && this.data.actions[key])
            return this.data.actions[key].params || this.data.globalParams;
        return {};
    }

    private formValid():boolean{
        if(this.instanceForm && this.instanceForm.form){
            return this.instanceForm.isValidForm();
        }
        return false;
    }

    private permissionValid(permission:string):boolean
    {
        if(this.data.model && this.data.model.permissions)
            return (this.data.model.permissions["list"]);
        return true;
    }

    private existData():boolean
    {
        return (this.data && this.data.model && this.data.model.dataList && this.data.model.dataList.list)
    }


}

