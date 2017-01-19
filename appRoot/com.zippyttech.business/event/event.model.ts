import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {RuleModel} from "../rule/rule.model";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

export class EventModel extends ModelBase{

    public publicData:any={};
    public rule:any={};

    constructor(public db:DependenciesBase){
        super(db,'EVENT','/events/');
        this.initModel(false);
        this.loadDataExternal();
    }
    modelExternal() {
        this.rule = new RuleModel(this.db);
    }
    initRules(){
        this.rules['code']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'code',
            'icon': 'fa fa-key',
            'title': 'Código',
            'placeholder': 'Código',
        }
        this.rules['actionType']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [],
            'key': 'actionType',
            'title': 'Tipo de acción',
            'placeholder': 'Seleccione un tipo de accción',
        }
        this.rules['way']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [],
            'key': 'way',
            'title': 'Canal',
            'placeholder': 'Seleccione un canal',
        }
        this.rules['over']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source':[],
            'key': 'over',
            'title': 'Dominio',
            'placeholder': 'Seleccione un dominio',
        }

        this.rules['message']={
            'type': 'textarea',
            'required':true,
            'showbuttons':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'message',
            'icon': 'fa fa-key',
            'title': 'Mensaje',
            'placeholder': 'Ingrese el mensaje',
        };

        this.rules['rule']=this.rule.ruleObject;
        this.rules['rule'].required = true;
        this.rules['rule'].update=this.permissions.update;

        this.rules['target']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'target',
            'icon': 'fa fa-key',
            'title': 'Target',
            'placeholder': 'Destino donde se enviara el mensaje',
        };
        this.rules['trigger']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'trigger',
            'icon': 'fa fa-key',
            'title': 'Trigger',
            'placeholder': 'Trigger',
        };
        this.rules['title']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'title',
            'icon': 'fa fa-key',
            'title': 'Asunto',
            'placeholder': 'Asunto',
        }

        this.rules['icon']={
            'type': 'text',
            'required':false,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'icon',
            'icon': 'fa fa-key',
            'title': 'Icono',
            'placeholder': 'Ingrese el icono',
        }

        this.globalOptional();

        this.rules = Object.assign({},this.rules,this.getRulesDefault());
        delete this.rules['detail'];
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
    loadDataExternal()
    {
        let that = this;
        let successCallback= response => {
            Object.assign(that.publicData,response.json())
            that.publicData.domains.forEach(obj=>{
                that.rules['over'].source.push({'value':obj.name,'text':obj.logicalPropertyName});
            });
            that.publicData.event.actionTypes.forEach(obj=>{
                that.rules['actionType'].source.push({'value':obj,'text':obj});
            });
            that.publicData.event.wayTypes.forEach(obj=>{
                that.rules['way'].source.push({'value':obj,'text':obj});
            })
            that.completed = true;
        }
        this.httputils.doGet(localStorage.getItem('url'),successCallback,this.error,true)
    }

}