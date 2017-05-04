import {ModelBase} from '../../com.zippyttech.common/modelBase';
import {RuleModel} from '../rule/rule.model';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';
import {TextRule} from '../../com.zippyttech.common/rules/text.rule';
import {ISelect, SelectRule} from '../../com.zippyttech.common/rules/select.rule';
import {TextareaRule} from '../../com.zippyttech.common/rules/textarea.rule';
import {IView} from '../../com.zippyttech.common/modelRoot';
import {ObjectRule} from '../../com.zippyttech.common/rules/object.rule';

export class EventModel extends ModelBase {

    constructor(public db: DependenciesBase) {
        super(db, '/events/');
        this.initModel(false);
    }

    initView(params: IView) {
    }

    initModelExternal() {
    }

    initDataActions() {
    }

    initPermissions() {
    }

    initModelActions() {
    }

    initRules() {

        this.rules['code'] = new TextRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-key'
        });

        this.rules['actionType'] = new SelectRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source: [],
        });

        this.rules['way'] = new SelectRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source: [],
        });

        this.rules['over'] = new SelectRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source: [],
        });

        this.rules['message'] = new TextareaRule({
            required: true,
            exclude: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-key'
        });

        this.rules['rule'] = new ObjectRule({
            model: new RuleModel(this.db),
            required: true,
            update: this.permissions.update,
        });

        this.rules['target'] = new TextRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-key'
        });

        this.rules['trigger'] = new TextRule({
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-key'
        });

        this.rules['title'] = new TextRule({
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-key'
        });

        this.rules['icon'] = new TextRule({
            required: false,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-key'
        });

        this.globalOptional();

        this.rules = Object.assign({}, this.rules, this.getRulesDefault());

    }

    initDataExternal() {

        this.db.myglobal.publicData.domains.forEach(obj => {
            (<ISelect>this.rules['over']).source.push({value: obj.name, text: obj.logicalPropertyName});
        });
        this.db.myglobal.publicData.event.actionTypes.forEach(obj => {
            (<ISelect>this.rules['actionType']).source.push({value: obj, text: obj});
        });
        this.db.myglobal.publicData.event.wayTypes.forEach(obj => {
            (<ISelect>this.rules['way']).source.push({'value': obj.name, 'text': obj.code});
        });
        this.completed = true;

    }

}