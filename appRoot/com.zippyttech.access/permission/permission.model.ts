import {IView, ModelRoot} from '../../com.zippyttech.common/modelRoot';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';
import {TextRule} from '../../com.zippyttech.common/rules/text.rule';

export class PermissionModel extends ModelRoot {

    constructor(public db: DependenciesBase) {
        super(db, '/permissions/');
        this.initModel();
    }

    initView(params: IView) {
    }

    initPermissions() {
    }

    initModelActions() {
    }

    initDataExternal() {
    }

    initModelExternal() {
    }

    initDataActions() {
    }

    initRules() {

        this.rules['code'] = new TextRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            }
        });

        this.rules['title'] = new TextRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
        });

        this.rules['module'] = new TextRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
        });

        this.rules['controlador'] = new TextRule({
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
        });

        this.rules['accion'] = new TextRule({
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
        });

        this.setRuleDetail(true, true, true);

        this.rules = Object.assign({}, this.rules, this.getRulesDefault());

    }


}