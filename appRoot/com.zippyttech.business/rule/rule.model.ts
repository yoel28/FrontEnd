import {ModelBase} from '../../com.zippyttech.common/modelBase';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';
import {TextRule} from '../../com.zippyttech.common/rules/text.rule';
import {TextareaRule} from '../../com.zippyttech.common/rules/textarea.rule';
import {IView} from '../../com.zippyttech.common/modelRoot';

export class RuleModel extends ModelBase {

    constructor(public db: DependenciesBase) {
        super(db, '/rules/');
        this.initModel();
    }

    initView(params: IView) {
    }

    initPermissions() {
    }

    initModelActions() {
    }

    initModelExternal() {
    }

    initDataActions() {
    }

    initDataExternal() {
    }

    initRules() {

        this.rules['code'] = new TextRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-key',
        });

        this.rules['rule'] = new TextareaRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-key',
        });

        this.rules['title'] = new TextRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            icon: 'fa fa-list',
        });

        this.globalOptional();

        this.rules = Object.assign({}, this.rules, this.getRulesDefault());

    }

}