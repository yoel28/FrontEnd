import {EventEmitter, Injectable} from '@angular/core';
import {IModalConfig, IModalParams, ModalName, TEventOutput} from './modal.types';

@Injectable()
export class ModalService {

    public params: IModalParams;
    public onVisible: EventEmitter<boolean>;
    public configs: { [key: string]: IModalConfig };
    public output:TEventOutput;

    private _currentModal = 'none';

    public readonly modalID: string = 'modal-service';

    public constructor() {
        this.onVisible = new EventEmitter<boolean>();
        this.initConfigs();
    }

    public get currentModal(): string {
        return this._currentModal
    };

    public show(name: ModalName, params: IModalParams) {
        if (this._currentModal == 'none') {
            this.params = params;
            this._currentModal = name;
            this.onVisible.emit(true);
        }
    }

    public hideCurrentModal() {
        if (this._currentModal != 'none') {
            this._currentModal = 'none';
            this.onVisible.emit(false);
            if (this.params.onAfterClose)
                this.params.onAfterClose(this.output);
        }
    }

    private initConfigs() {
        this.configs = {};

        this.configs['default'] = {
            id: this.modalID,
            size: 'md',
            header: {classes: '', title: ''},
            footer: {}
        };

        this.configs['delete'] = {
            id: this.modalID,
            size: 'sm',
            header: {title: 'Eliminar', classes: 'bg-red'},
            footer: {
                btns: [{
                    name: 'cancelar', classes: 'btn-default', icon: 'fa fa-ban',
                    call: () => {
                        this.hideCurrentModal();
                    }
                },
                    {
                        name: 'Eliminar', classes: 'btn-red', icon: 'fa fa-trash',
                        call: () => {
                            this.params.model.onDelete(this.params.model.currentData.id);
                            this.hideCurrentModal();
                        }
                    }]
            }
        };

        this.configs['save'] = {
            id: this.modalID,
            size: 'lg',
            header: {title: 'Guardar', classes: 'bg-green'}
        };

        this.configs['filter'] = {
            id: this.modalID,
            size: 'lg',
            header: {title: 'Guardar', classes: 'bg-info'}
        };

        this.configs['location'] = {
            id: this.modalID,
            size: 'md',
            header: {title: 'Ubicación', classes: 'bg-green'},
            footer: {
                btns: [{
                    name: 'Cancelar', classes: 'btn-default', icon: 'fa fa-ban',
                    call: () => {
                        this.hideCurrentModal();
                    }
                },
                    {
                        name: 'Guardar', classes: 'btn-green', icon: 'fa fa-save', exp: 'params.extraParams.disabled',
                        call: () => {
                            let json = {};
                            json[this.params.extraParams.keys.lat] = (this.params.extraParams.data.lat).toString();
                            json[this.params.extraParams.keys.lng] = (this.params.extraParams.data.lng).toString();
                            this.params.model.onPatchObject(json, this.params.extraParams.select);
                            this.hideCurrentModal();
                        }
                    }]
            }
        };
    }
}