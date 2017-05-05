import {IRule, Rule, IIncludeComponents} from './rule';
import {Actions} from "../../com.zippyttech.init/app/app.types";
import {RuleViewComponent} from "../../com.zippyttech.ui/components/ruleView/ruleView.component";

export interface ILocation extends IRule {

}

export class LocationRule extends Rule {

    constructor(private rule: ILocation) {
        super(rule);
        this._loadActions();
    }
    private _loadActions() {
        this.attributes.actions = new Actions<IIncludeComponents>();
        this.attributes.actions.add('view_list', {
            permission: this.permissions['list'] && this.permissions['update'],
            views: [
                {icon: 'fa fa-map-marker fa-lg', title: 'viewLocation', colorClass: 'text-red'},
            ],
            callback: (rule: RuleViewComponent, key: string) => {
                rule.model.currentData = rule.data;
                rule.model.db.ms.show('location', {model: rule.model,onAfterClose:()=>{
                    // this.model.onPatch(key,rule.data,)//TODO: Callback despues de cerrar el location;
                }});
            },
            stateEval: '0',
            params: {
                list: true
            }
        });
    }

}