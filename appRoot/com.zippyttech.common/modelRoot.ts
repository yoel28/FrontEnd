import {StaticValues} from '../com.zippyttech.utils/catalog/staticValues';
import {IRestEvent, IWhere, RestController} from '../com.zippyttech.rest/restController';
import {DependenciesBase} from './DependenciesBase';
import {Actions} from '../com.zippyttech.init/app/app.types';
import {TextareaRule} from './rules/textarea.rule';
import {NumberRule} from './rules/number.rule';
import {TextRule} from './rules/text.rule';
import {CombodateRule} from './rules/combodate.rule';
import {API} from '../com.zippyttech.utils/catalog/defaultAPI';

let moment = require('moment');

interface IDataActionParams {
    id?: string;
    message?: string;
}

interface IModelActionParams {
}

export type modeOptions = 'reference' | 'checklist';

export interface IModelFilter {
    [key: string]: {
        view: [{
            title: string,
            icon: string,
            colorClass?: string;
            where: IWhere
        }],
        status: number,
        permission: boolean;
        callback(model?: ModelRoot);
    };
}
export interface IView {
    display: string;
    key: string;
    code: string;
    icon?: string;
    eval?: string;
    visible?: boolean;
    mode?: modeOptions;
    exclude?: boolean;
    components?: IComponents
}
export interface IComponents {
    form?: {
        onlyRequired?: boolean
    }
}

export abstract class ModelRoot extends RestController {
    public prefix = ((this.constructor.name).toUpperCase()).replace('MODEL', '');
    public endpoint = 'DEFAULT_ENDPOINT';
    public useGlobal = true;
    public completed = false;
    public permissions: any = {};
    public paramsSearch: any = {};
    public paramsSave: any = {};

    public dataActions: Actions<IDataActionParams>;
    public modelActions: Actions<IModelActionParams>;

    public filters: IModelFilter = {};

    public view: IView;

    private _currentData: any;
    public get currentData() {
        return this._currentData;
    };

    public set currentData(value) {
        this._currentData = value;
    };

    private rulesDefault: any = {};
    public rules: Object = {};
    private _navIndex: number = null;
    private _transactional: boolean;
    private pendings: number;

    evAfterDelete: (args: Object) => void;

    abstract initView1(params: IView);

    constructor(public db: DependenciesBase, endpoint: string, useGlobal: boolean = true, prefix?: string) {
        super(db);
        if (prefix)
            this.prefix = prefix;
        this.setEndpoint(endpoint);
        this.useGlobal = useGlobal;
        this._initModel();
        this.events.subscribe((event) => this._onEvents(event));
    }

    public set navIndex(value: number | string) {
        if (value != null) {
            let n = (typeof value === 'string') ? Number(value) : this._navIndex + value;
            if (n < 0 && this.getRest().offset + n > 0) {
                this.loadData(this.getRest().offset / this.getRest().max).then(function (response) {
                    this._navIndex = this.getRest().max + n;
                    this.refreshData(this.getData().list[this.navIndex]);
                }.bind(this));
            }
            else if (n > this.getRest().max - 1 && this.getRest().offset + n < this.getData().count) {
                this.loadData(2 + this.getRest().offset / this.getRest().max).then(function (response) {
                    this._navIndex = n - this.getRest().max;
                    this.refreshData(this.getData().list[this.navIndex]);
                }.bind(this));
            }
            else if (n >= 0 && n <= this.getRest().max - 1 && this.getRest().offset + n < this.getData().count)
                this._navIndex = n;
            this.refreshData(this.getData().list[this.navIndex]);
        }
        else this._navIndex = null;
    }

    public get navIndex() {
        return this._navIndex;
    }

    private _initModel() {
        this._initView();
        this._initPermissions();
        this._initRules();
        this._initParamsSearch();
        this._initParamsSave();
        this._initDataActions();
        this._initModelActions();
    }

    public initModel(completed = true) {
        this.initView(this.view);
        this.initPermissions();
        this.initModelExternal();
        this.initRules();

        this.db.ws.loadChannelByModel(this.constructor.name, this);

        this.initDataActions();
        this.initModelActions();

        this.completed = completed;

        this.initDataExternal();

    }

    abstract initView(params: IView);

    private _initView() {
        this.view = {
            code: this.nameClass + 'Id',
            display: this.nameClass + 'Code',
            key: this.nameClass,
            visible: true,
        }
    }

    abstract initPermissions();

    private _initPermissions() {
        this.permissions['exportPdf'] = this.db.myglobal.existsPermission([this.prefix + '_EXPORT_PDF']);
        this.permissions['exporXls'] = this.db.myglobal.existsPermission([this.prefix + '_EXPORT_XLS']);

        this.permissions['showAll'] = this.db.myglobal.existsPermission([this.prefix + '_SHOW_ALL']);
        this.permissions['showDelete'] = this.db.myglobal.existsPermission([this.prefix + '_SHOW_DELETED']);
        this.permissions['list'] = this.db.myglobal.existsPermission([this.prefix + '_LIST']);
        this.permissions['add'] = this.db.myglobal.existsPermission([this.prefix + '_ADD']);
        this.permissions['update'] = this.db.myglobal.existsPermission([this.prefix + '_UPDATE']);
        this.permissions['delete'] = this.db.myglobal.existsPermission([this.prefix + '_DELETE']);
        this.permissions['filter'] = this.db.myglobal.existsPermission([this.prefix + '_FILTER']);
        this.permissions['search'] = this.db.myglobal.existsPermission([this.prefix + '_SEARCH']);
        this.permissions['lock'] = this.db.myglobal.existsPermission([this.prefix + '_LOCK']);
        this.permissions['warning'] = this.db.myglobal.existsPermission([this.prefix + '_WARNING']);
        this.permissions['visible'] = true;//this.myglobal.existsPermission([this.prefix + '_VISIBLE']);
        this.permissions['audit'] = this.db.myglobal.existsPermission([this.prefix + '_AUDIT']);
        this.permissions['global'] = this.db.myglobal.existsPermission(['ACCESS_GLOBAL']) && this.useGlobal;
    }

    abstract initDataActions();

    private _initDataActions() {
        this.dataActions = new Actions<IDataActionParams>();
        this.dataActions.add('view', {
            disabled: (data) => {
                return true;
            },
            permission: this.permissions.list, //TODO: check view
            views: [{title: 'ver', icon: 'fa fa-vcard'}],
            callback: (data?, index?) => {
                this.currentData = data;
                this.navIndex = index;
            },
            stateEval: '0'
        });

        this.dataActions.add('enabled', {
            permission: this.permissions.lock && this.permissions.update,
            disabled: (data: any): boolean => {
                return data.deleted;
            },
            views: [
                {icon: 'fa fa-lock', title: 'Deshabilitado', colorClass: 'text-red'},
                {icon: 'fa fa-unlock', title: 'Habilitado', colorClass: 'text-green'}
            ],
            callback: (data?, index?) => {
                this.currentData = data;
                this.onLock('enabled', data);
            },
            stateEval: (data: any): number => {
                return data.enabled ? 1 : 0;
            }
        });

        this.dataActions.add('editable', {
            permission: this.permissions.lock && this.permissions.update,
            disabled: (data: any): boolean => {
                return !data.enabled || data.deleted;
            },
            views: [
                {icon: 'fa fa-edit', title: 'No Editable', colorClass: 'text-red'},
                {icon: 'fa fa-pencil', title: 'Editable', colorClass: 'text-green'},
            ],
            callback: (data?: any, index?) => {
                this.currentData = data;
                this.onLock('editable', data);
            },
            stateEval: (data: any): number => {
                return data.editable ? 1 : 0;
            },
        });

        this.dataActions.add('visible', {
            permission: this.permissions.update && this.permissions.visible,
            disabled: (data: any): boolean => {
                return !data.enabled || data.deleted
            },
            views: [
                {icon: 'fa fa-eye-slash', title: 'Oculto', colorClass: 'text-red'},
                {icon: 'fa fa-eye', title: 'Visible', colorClass: 'text-green'}
            ],
            callback: (data?, index?) => {
                this.currentData = data;
                this.onPatch('visible', data);
            },
            stateEval: (data) => {
                return data.visible ? 1 : 0;
            },
        });

        this.dataActions.add('delete', {
            permission: this.permissions.delete,
            disabled: (data: any): boolean => {
                return !data.enabled || !data.editable || data.deleted
            },
            views: [
                {icon: 'fa fa-trash', title: 'Eliminar'}
            ],
            callback: (data?, index?) => {
                this.currentData = data;
                this.db.ms.show('delete', {model: this});
            },
            stateEval: '0',
        });
    }

    abstract initModelActions();

    private _initModelActions() {
        this.modelActions = new Actions<IModelActionParams>();
        this.modelActions.add('add', {
            permission: this.permissions.add,
            views: [{title: 'agregar', icon: 'fa fa-plus', colorClass: 'text-green'}],
            callback: (data?, index?) => {
                this.db.ms.show('save', {model: this});
            },
            stateEval: '0',
            params: {}
        });

        this.modelActions.add('filter', {
            permission: this.permissions.filter,
            views: [
                {icon: 'fa fa-filter', title: 'sin filtro', colorClass: 'text-blue'},
                {icon: 'fa fa-filter', title: 'filtrando', colorClass: 'text-green'}
            ],
            callback: (data?, index?) => {
                this.db.ms.show('filter', {model: this});
            },
            stateEval: '0',
            params: {}
        });

        this.modelActions.add('showDelete', {
            permission: this.permissions.showDelete,
            views: [
                {icon: 'fa fa-trash', title: 'Eliminados ocultos', colorClass: ''},
                {icon: 'fa fa-trash', title: 'Solo eliminados', colorClass: 'text-red'},
                {icon: 'fa fa-trash', title: 'Todo', colorClass: 'text-yellow'},],
            callback: (data?, index?) => {
                this.changeDeleted();
            },
            stateEval: (data: any): number => {
                return (this.getRest().deleted == 'all') ? 2 : (this.getRest().deleted == 'only') ? 1 : 0;
            },
            params: {}
        });

        this.modelActions.add('refresh', {
            permission: this.permissions.update && this.permissions.visible,
            views: [
                {icon: 'fa fa-refresh', title: 'Actualizar', colorClass: 'text-blue'},
                {icon: 'fa fa-refresh fa-spin', title: 'Actualizando', colorClass: 'text-yellow'}
            ],
            callback: (data?, index?) => {
                this.loadData();
            },
            stateEval: (data): number => {
                return this.rest.findData ? 1 : 0;
            },
            params: {}

        });

        this.modelActions.add('exportPdf', {
            permission: this.permissions.exportPdf,
            views: [{
                icon: 'fa fa-file-pdf-o', colorClass: '',
                title: this.db.msg.exportDisabled + this.getParams('REPORT_LIMIT_ROWS_PDF', API.REPORT_LIMIT_ROWS_PDF) + ' ' + this.db.msg.rows
            },
                {icon: 'fa fa-file-pdf-o', title: this.db.msg.exportPdf, colorClass: 'text-red'}],
            callback: ((data?, index?) => {
                if (this.getEnabledReport('PDF')) {
                    let url = localStorage.getItem('urlAPI') + this.endpoint +
                        this.getRestParams() + '&access_token=' +
                        localStorage.getItem('bearer') + '&formatType=pdf' +
                        '&tz=' + moment().format('Z').replace(':', '');
                    window.open(url, '_blank');
                }
            }).bind(this),
            stateEval: 'data.getEnabledReport(\'PDF\')?1:0',
            params: {}
        });

        this.modelActions.add('exporXls', {
            permission: this.permissions.exporXls,
            views: [{
                icon: 'fa fa-file-excel-o', colorClass: '',
                title: this.db.msg.exportDisabled + this.getParams('REPORT_LIMIT_ROWS_XLS', API.REPORT_LIMIT_ROWS_XLS) + ' ' + this.db.msg.rows
            },
                {icon: 'fa fa-file-excel-o', title: this.db.msg.exportXls, colorClass: 'text-green'}],
            callback: ((data?, index?) => {
                if (this.getEnabledReport('XLS')) {
                    let url = localStorage.getItem('urlAPI') + this.endpoint +
                        this.getRestParams() + '&access_token=' +
                        localStorage.getItem('bearer') + '&formatType=xls' +
                        '&tz=' + moment().format('Z').replace(':', '');
                    window.open(url, '_blank');
                }
            }).bind(this),
            stateEval: 'data.getEnabledReport(\'XLS\')?1:0',
            params: {}
        });
    }

    private addActionsSearcForm() {
        let action = new Actions();
        action.add('search', {
            permission: this.permissions.search,
            views: [
                {title: 'Buscar', icon: 'fa fa-search', colorClass: 'text-blue'}
            ],
            callback: ((data?, index?) => {
                    this.loadData(null, true);
                }
            ).bind(this),
            stateEval: '0',
            params: {}
        });
    }


    abstract initModelExternal();

    abstract initRules();

    abstract initDataExternal();

    private _initRules() {
        this.setRuleDetail();
        this.setRuleId();
        this.setRuleIp();
        this.setRuleUserAgent();
        this.setRuleUsernameCreator();
        this.setRuleUsernameUpdater();
        this.setRuleDateCreated();
        this.setRuleDateUpdated();
    }

    setRuleDetail(save = false, required = false, visible = false) {
        this.rulesDefault['detail'] = new TextareaRule({
            required: required,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible || visible,
            },
            include: {
                save: save,
                filter: true,
                list: true
            },
        });
    }

    setRuleId(force = false, visible = false) {
        if (this.permissions.audit || force) {
            this.rulesDefault['id'] = new NumberRule({
                permissions: {
                    search: this.permissions.filter,
                    visible: visible
                },
                include: {
                    save: false,
                    filter: true,
                    list: true
                },
            });
        }
    }

    setRuleIp(force = false, visible = false) {
        if (this.permissions.audit || force) {
            this.rulesDefault['ip'] = new TextRule({
                permissions: {
                    search: this.permissions.filter,
                    visible: visible
                },
                include: {
                    save: false,
                    filter: true,
                    list: true
                },
            });
        }
    }

    setRuleUserAgent(force = false, visible = false) {
        if (this.permissions.audit || force) {
            this.rulesDefault['userAgent'] = new TextRule({
                permissions: {
                    search: this.permissions.filter,
                    visible: visible
                },
                include: {
                    save: false,
                    filter: true,
                    list: true
                },
            });
        }
    }

    setRuleUsernameCreator(force = false, visible = false) {
        if (this.permissions.audit || force) {
            this.rulesDefault['usernameCreator'] = new TextRule({
                permissions: {
                    search: this.permissions.filter,
                    visible: visible
                },
                include: {
                    save: false,
                    filter: true,
                    list: true
                },
            });
        }
    }

    setRuleUsernameUpdater(force = false, visible = false) {
        if (this.permissions.audit || force) {
            this.rulesDefault['usernameUpdater'] = new TextRule({
                permissions: {
                    search: this.permissions.filter,
                    visible: visible
                },
                include: {
                    save: false,
                    filter: true,
                    list: true
                },
            });
        }
    }

    setRuleDateCreated(force = false, visible = false) {
        if (this.permissions.audit || force) {
            this.rulesDefault['dateCreated'] = new CombodateRule({
                permissions: {
                    search: this.permissions.filter,
                    visible: visible
                },
                include: {
                    save: false,
                    filter: true,
                    list: true
                },
                date: 'datetime',
            });
        }
    }

    setRuleDateUpdated(force = false, visible = false) {
        if (this.permissions.audit || force) {
            this.rulesDefault['dateUpdated'] = new CombodateRule({
                permissions: {
                    search: this.permissions.filter,
                    visible: visible
                },
                include: {
                    save: false,
                    filter: true,
                    list: true
                },
                date: 'datetime',
            });
        }
    }


    private _initParamsSearch() { //TODO: Eliminar
        this.paramsSearch = {
            'title': 'Title Default',
            'permission': (this.permissions.search && this.permissions.list),
            'endpoint': '/search' + this.endpoint,
            'placeholder': 'Placeholder default',
            'label': {'title': 'título: ', 'detail': 'detalle: '},
            'msg': {
                'errors': {
                    'noAuthorized': this.db.msg.noAuthorized,
                },
            },
            'where': [],
            'imageGuest': StaticValues.pathElements.isotipoMini,
            'field': 'any',
            'count': 0
        };
    }

    private _initParamsSave() {
        this.paramsSave = {
            'title': 'Title Default',
            'updateField': false,
            'permission': this.permissions.add,
            'endpoint': this.endpoint,
            'customValidator': null,
            'onlyRequired': false,
            'customActions': [],
        };
    }

    getRulesDefault() {
        return this.rulesDefault;
    }


    public extendRulesObjectInRules(rules) {//TODO: Recorrer todo el object rule para mostrar la dat que devuelva la aPI
        let that = this;

        Object.keys(rules).forEach(key => {
            if (rules[key].object) {
                Object.keys(rules[key].rulesSave).forEach(subKey => {
                    rules[key + that.capitalizeFirstLetter(subKey)] = rules[key].rulesSave[subKey];
                    rules[key + that.capitalizeFirstLetter(subKey)].search = false;
                })
            }
        })
    }

    public capitalizeFirstLetter(data) {
        return data.charAt(0).toUpperCase() + data.slice(1);
    }

    public spliceId(id: string) {
        if (this.getData().list) {
            let index = this.getIndexById(id);
            if (index != -1)
                this.getData().list.splice(index, 1);
        }
    }

    public getIndexById(id: string): number {
        if (this.getData().list)
            return this.getData().list.findIndex(obj => obj['id'] == id);
        return -1;
    }

    public getIncludeKeys(keys: Array<string>, inSave = false) {
        let data = {};
        keys.forEach((key => {
            if (this.rules && this.rules[key]) {
                if (!inSave || (inSave && this.rules[key].permissions.save))
                    data[key] = this.rules[key];
            }
        }).bind(this));
        return data;
    }

    public getExcludeKeys(exclude: Array<string>, inSave = false) {
        let data = {};
        Object.keys(this.rules).forEach(key => {
            if (exclude.indexOf(key) < 0) {
                if (!inSave || (inSave && this.rules[key].permissions.save))
                    data[key] = this.rules[key];
            }
        });
        return data;
    }

    public setLoadData(data) {
        this.getData().list.unshift(data);
        this.getData().count++;
        if (this.getData().count > this.getRest().max)
            this.getData().list.pop();
    }

    public setUpdateData(data) {
        if (data.id) {
            let index = this.getIndexById(data.id);
            if (index >= 0) {
                Object.assign(this.getData().list[index], data);
            }
        }
    }

    public setDeleteData(data) {
        if (data.id) {
            let index = this.getIndexById(data.id);
            if (index >= 0) {
                this.getData().list.splice(index, 1);
            }
        }
    }

    public setBlockField(data, value?: boolean) {
        if (data.id) {
            let index = this.getIndexById(data.id);
            if (index >= 0) {
                this.getData().list[index]['blockField'] = value == null ? !this.getData().list[index]['blockField'] : value;
            }
        }
    }

    public refreshData(data) {
        this.setBlockField(data, true);
        setTimeout(function () {
            this.setBlockField(data, false);
        }.bind(this), 100);
    }

    public refreshList() {
        if (this.getData()) {
            if (this.getData().list) {
                this.getData().list.forEach(function (data) {
                    this.refreshData(data);
                }.bind(this));
            }
            else
                this.refreshData(this.getData());
        }

    }

    public updateModelFilter(event, key) {
        if (event)
            event.preventDefault();

        if (this.filters && this.filters[key]) {
            let currentFilter = this.filters[key];
            if (currentFilter.view[currentFilter.status]) {
                if (currentFilter.view[currentFilter.status].where) {
                    let code = currentFilter.view[currentFilter.status].where[0]['code'];
                    this.removedCodeFilter(code);

                }
                currentFilter.status = currentFilter.view[currentFilter.status + 1] ? (currentFilter.status + 1) : 0;

                if (currentFilter.view[currentFilter.status] && currentFilter.view[currentFilter.status].where) {
                    let where: IWhere;
                    if (this.getRest().where)
                        where = (<any>this.getRest().where).concat(currentFilter.view[currentFilter.status].where);
                    else
                        where = currentFilter.view[currentFilter.status].where;

                    this.getRest().where = where;
                }

            }
            this.loadData();
        }
    }

    public get nameClass() {
        return (this.constructor.name).replace('Model', '').toLowerCase();
    }

    //TODO: completed events... define
    private _onEvents(eventArgs: IRestEvent) {
        switch (eventArgs.type) {
            case 'afterDelete':
                if (this.evAfterDelete)
                    this.evAfterDelete(eventArgs.args);
                break;

            case 'afterSave':
                this.evAfterSave(eventArgs.args);
                break;
        }
    }


    protected evAfterSave(args) {
        console.log('SAVE EVENT');
    }


    public getEnabledReport(type: 'PDF' | 'XLS' = 'PDF') {
        if (type == 'PDF')
            return (this.getParams('REPORT_LIMIT_ROWS_PDF', API.REPORT_LIMIT_ROWS_PDF) >= this.getData().count);
        return (this.getParams('REPORT_LIMIT_ROWS_XLS', API.REPORT_LIMIT_ROWS_XLS) >= this.getData().count);
    }

    public getParams(code: string, defaultValue?) {
        return this.db.myglobal.getParams(code, defaultValue)
    }

    public  getCurrentPage(search = false): number {
        return ((this.getRest(search).offset / this.getRest(search).max) + 1);
    }

}