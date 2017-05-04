import {ModelBase} from '../../com.zippyttech.common/modelBase';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';
import {TextRule} from '../../com.zippyttech.common/rules/text.rule';
import {ColorRule} from '../../com.zippyttech.common/rules/color.rule';
import {SelectRule} from '../../com.zippyttech.common/rules/select.rule';
import {IView} from '../../com.zippyttech.common/modelRoot';

export class InfoModel extends ModelBase {

    constructor(public db: DependenciesBase) {
        super(db, '/infos/');
        this.initModel();
    }

    initView(params: IView) {
    }

    initModelExternal() {
    }

    initPermissions() {
    }

    initModelActions() {
    }

    initDataActions() {
    }

    initDataExternal() {
    }

    initRules() {

        this.rules['code'] = new TextRule({
            protected: true,
            readOnly: true, //TODO : change in save
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
                'update': this.permissions.update,
                'search': this.permissions.filter,
                'visible': this.permissions.visible,
            },
            icon: 'fa fa-key'
        });

        this.rules['color'] = new ColorRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                visible: this.permissions.visible,
            },
            value: '00ff00'
        });

        this.rules['position'] = new SelectRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source: [
                {value: 'top', text: 'Arriba'},
                {value: 'bottom', text: 'Abajo'},
                {value: 'left', text: 'Izquierda'},
                {value: 'right', text: 'Derecha'},
            ],
        }),

            this.rules['size'] = new SelectRule({
                required: true,
                permissions: {
                    update: this.permissions.update,
                    search: this.permissions.filter,
                    visible: this.permissions.visible,
                },
                source: [
                    {value: 'fa', text: 'Normal'},
                    {value: 'fa-lg', text: 'Lg'},
                    {value: 'fa-2x', text: '2x'},
                    {value: 'fa-3x', text: '3x'},
                    {value: 'fa-4x', text: '4x'},
                    {value: 'fa-5x', text: '5x'},

                ],
            });

        this.rules['icon'] = new SelectRule({
            exclude: true,
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source: [
                {value: 'fa fa-question-circle', text: 'Interrogante 1'},
                {value: 'fa fa-question', text: 'Interrogante 2'},
            ],
        });

        this.globalOptional();

        this.rules = Object.assign({}, this.rules, this.getRulesDefault());

    }

}