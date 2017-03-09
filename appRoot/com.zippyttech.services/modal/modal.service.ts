import {Injectable, EventEmitter} from "@angular/core";
import {IModal} from "../../com.zippyttech.ui/components/modalView/modalView.component";
import {ILocation} from "../../com.zippyttech.ui/components/locationPicker/locationPicker.component";

var jQuery = require('jquery');

export interface IModalLocation{
    locationParams: ILocation;
    //TODO: Developing -> content[missing, check]
}
export interface IModalDelete{
    dataSelect:Object;
}
export interface IModalRule{
    title:string;
    rule:Object;
    dataRule:Object;
    //TODO: Developing -> content[check]
}
export interface IModalParams{
    model:any;
    cfgParams?: IModalDelete | IModalSave | IModalSearch | IModalLocation;
}
export interface IModalSearch{}
export interface IModalSave{}

export interface IStatusModal{
    currentModal:string;
    visible:boolean;
}

@Injectable()
export class ModalService {
    private _currentModal = "none";
    public params: IModalParams;
    public onVisible: EventEmitter<boolean>;
    public configs:{[key:string]:IModal};

    public constructor() {
        this.onVisible = new EventEmitter<boolean>();
        this.initConfigs();
    }
    public get currentModal(): string { return this._currentModal };

    public show(name: 'delete'|'save', params: IModalParams) {
        if (this._currentModal == "none") {
            this.params = params;
            this._currentModal = name;
            this.onVisible.emit(true);
        }
    }

    public hideCurrentModal() {
        if (this._currentModal != "none") {
            this._currentModal = "none";
            this.onVisible.emit(false);
        }
    }

    private initConfigs() {
        this.configs = {};

        this.configs['default'] = {
            id:'modal-service', global:{ size:'modal-md' },
            header:{class:'',title:''},
            body:{},
            footer:[]
        }

        this.configs['delete'] = {
            id:'modal-service', global:{ size:'modal-sm' },
            header:{ title: 'Eliminar', class: 'bg-red'},
            footer:[
                { title:'cancelar', class:'btn-default', icon:'fa fa-ban',
                  callback: ()=>{ this.hideCurrentModal(); } },
                { title:'Eliminar', class:'btn-red', icon:'fa fa-trash',
                  callback: ()=>{ this.hideCurrentModal();} }
                  ]
        }
    }
}