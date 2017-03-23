import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {TextRule} from "../../com.zippyttech.common/rules/text.rule";
import {ColorRule} from "../../com.zippyttech.common/rules/color.rule";
import {SelectRule} from "../../com.zippyttech.common/rules/select.rule";
import {IView} from "../../com.zippyttech.common/modelRoot";

export class InfoModel extends ModelBase{

    constructor(public db:DependenciesBase){
        super(db,'/infos/');
        this.initModel();
    }
    modelExternal() {}

    initView(params:IView){
        params.title = "Información (Ayudas)";
    }

    initRules(){
        this.rules['code']= new TextRule({
            protected:true,
            readOnly:true, //TODO : change in save
            required:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            key: 'code',
            icon: 'fa fa-key',
            title: 'Código',
            placeholder: 'Ingrese el código',
        });
        this.rules['title']=new TextRule( {
            required:true,
            permissions: {
                'update': this.permissions.update,
                'search': this.permissions.filter,
                'visible': this.permissions.visible,
            },
            key: 'title',
            icon: 'fa fa-key',
            title: 'Título',
            placeholder: 'Ingrese el título',
        });
        this.rules['color']= new ColorRule({
            required:true,
            permissions: {
                update: this.permissions.update,
                visible: this.permissions.visible,
            },
            key: 'color',
            value:'00ff00',
            title: 'Color',
            placeholder: '#000',
        })
        this.rules['position']= new SelectRule({
            required:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source: [
                {value: 'top',      text: 'Arriba'},
                {value: 'bottom',   text:'Abajo'},
                {value: 'left',     text: 'Izquierda'},
                {value: 'right',    text: 'Derecha'},
            ],
            key: 'position',
            title: 'Posición',
            placeholder: 'Seleccione una posición',
        }),
        this.rules['size']= new SelectRule({
            required:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source: [
                {value: 'fa',    text: 'Normal'},
                {value: 'fa-lg', text:'Lg'},
                {value: 'fa-2x', text:'2x'},
                {value: 'fa-3x', text:'3x'},
                {value: 'fa-4x', text:'4x'},
                {value: 'fa-5x', text:'5x'},

            ],
            key: 'size',
            title: 'Tamaño',
            placeholder: 'Seleccione un tamaño',
        });
        this.rules['icon']= new SelectRule({
            exclude:true,
            required:true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source: [
                {value: 'fa fa-question-circle',    text: 'Interrogante 1'},
                {value: 'fa fa-question',           text: 'Interrogante 2'},
            ],
            key: 'icon',
            title: 'Icono',
            placeholder: 'Seleccione un icono',
        });

        this.globalOptional();

        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar ayuda";
        this.paramsSearch.placeholder="Ingrese codigo de la ayuda";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar ayuda"
    }

    initModelActions(params){
        params['delete'].message='¿Esta seguro de eliminar la ayuda : ';
    }

}