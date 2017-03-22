import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {RuleModel} from "../rule/rule.model";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {TextRule} from "../../com.zippyttech.common/rules/text.rule";
import {SelectRule, ISelect} from "../../com.zippyttech.common/rules/select.rule";
import {TextareaRule} from "../../com.zippyttech.common/rules/textarea.rule";
import {IView} from "../../com.zippyttech.common/modelRoot";

export class EventModel extends ModelBase{

    public rule:RuleModel;

    constructor(public db:DependenciesBase){
        super(db,'/events/');
        this.initModel(false);
        this.loadDataPublic();
    }

    initView(params:IView){
        params.title = "Evento";
    }

    modelExternal() {
        this.rule = new RuleModel(this.db);
    }

    initRules(){

        this.rules['code']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'code',
            icon: 'fa fa-key',
            title: 'Código',
            placeholder: 'Código',
        });

        this.rules['actionType']= new SelectRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,},
            source: [],
            key: 'actionType',
            title: 'Tipo de acción',
            placeholder: 'Seleccione un tipo de accción',
        });

        this.rules['way']= new SelectRule({
            required:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source: [],
            key: 'way',
            title: 'Canal',
            placeholder: 'Seleccione un canal',
        });

        this.rules['over']= new SelectRule({
            required:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source:[],
            key: 'over',
            title: 'Dominio',
            placeholder: 'Seleccione un dominio',
        });

        this.rules['message']= new TextareaRule({
            required:true,
            exclude:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key: 'message',
            icon: 'fa fa-key',
            title: 'Mensaje',
            placeholder: 'Ingrese el mensaje',
        });

        this.rules['rule']=this.rule.ruleObject;
        this.rules['rule'].required = true;
        this.rules['rule'].update=this.permissions.update;

        this.rules['target']= new TextRule({
            required:true,
            permissions:{
                update:this.permissions.update,
                search:this.permissions.filter,
                visible:this.permissions.visible,
            },
            key: 'target',
            icon: 'fa fa-key',
            title: 'Target',
            placeholder: 'Destino donde se enviara el mensaje',
        });

        this.rules['trigger']= new TextRule({
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key: 'trigger',
            icon: 'fa fa-key',
            title: 'Trigger',
            placeholder: 'Trigger',
        });

        this.rules['title']= new TextRule({
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key: 'title',
            icon: 'fa fa-key',
            title: 'Asunto',
            placeholder: 'Asunto',
        });

        this.rules['icon']= new TextRule({
            required:false,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key: 'icon',
            icon: 'fa fa-key',
            title: 'Icono',
            placeholder: 'Ingrese el icono',
        })

        this.globalOptional();

        this.rules = Object.assign({},this.rules,this.getRulesDefault());

    }
    initPermissions() {}

    initParamsSearch() {
        this.paramsSearch.title="Buscar eventos";
        this.paramsSearch.placeholder="Ingrese codigo del evento";
    }

    initParamsSave() {
        this.paramsSave.title="Agregar evento"
    }

    initRuleObject() {
        this.ruleObject.title="Eventos";
        this.ruleObject.placeholder="Ingrese codigo del evento";
        this.ruleObject.key="event";
        this.ruleObject.keyDisplay="eventCode";
        this.ruleObject.code="eventId";
    }

    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.detail;
        delete this.rulesSave.enabled;
    }

    loadDataPublic() {

        let that = this;
        that.db.myglobal.publicData.domains.forEach(obj=>{
            (<ISelect>that.rules['over']).source.push({value:obj.name,text:obj.logicalPropertyName});
        });
        that.db.myglobal.publicData.event.actionTypes.forEach(obj=>{
            (<ISelect>that.rules['actionType']).source.push({value:obj,text:obj});
        });
        that.db.myglobal.publicData.event.wayTypes.forEach(obj=>{
            (<ISelect>that.rules['way']).source.push({value:obj,text:obj});
        })
        that.completed = true

    }
    initModelActions(params){
        params['delete'].message = '¿ Esta seguro de eliminar el evento: ';
    }

}