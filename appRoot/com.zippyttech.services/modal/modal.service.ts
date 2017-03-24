import {Injectable, EventEmitter} from "@angular/core";
import {IModalConfig, IModalParams, IModalDelete, IModalParamsType, ModalName} from "./modal.types";

@Injectable()
export class ModalService {
    private _currentModal = "none";
    public params:IModalParams<any>;
    public onVisible: EventEmitter<boolean>;
    public configs:{[key:string]:IModalConfig};

    public readonly modalID:string = "modal-service";

    public constructor() {
        this.onVisible = new EventEmitter<boolean>();
        this.initConfigs();
    }
    public get currentModal(): string { return this._currentModal };

    public show(name:ModalName, params:IModalParams<any>) {
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
            if(this.params.onAfterClose)
                this.params.onAfterClose();
        }
    }

    private initConfigs() {
        this.configs = {};

        this.configs['default'] = {
            id:this.modalID,
            size:'md',
            header:{classes:'',title:''},
            body:{},
            footer:{}
        };

        this.configs['delete'] = {
            id: this.modalID,
            size:'sm',
            header:{ title: 'Eliminar', classes: 'bg-red'},
            footer: {
                btns:[{ name: 'cancelar', classes: 'btn-default', icon: 'fa fa-ban',
                        call:()=>{ this.hideCurrentModal(); }
                      },
                      { name: 'Eliminar', classes: 'btn-red', icon: 'fa fa-trash',
                        call:()=>{
                            this.params.model.onDelete(this.params.model.currentData.id);
                            this.hideCurrentModal();
                        }
                      }]
            }
        };

        this.configs['save'] = {
            id:this.modalID,
            size:'lg',
            header:{ title: 'Guardar', classes: 'bg-green'}
        };
    }
}