import {Component, ElementRef, OnInit} from '@angular/core';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';
import {IModalConfig} from './modal.types';

let jQuery = require('jquery');
@Component({
    selector: 'modal',
    templateUrl: './template.html',
    styleUrls: ['./modal.style.css']
})
export class ModalComponent implements OnInit {
    public config: IModalConfig;
    private _visible: boolean;
    private $frame: HTMLElement;

    public constructor(private db: DependenciesBase, private el: ElementRef) {
        this.el.nativeElement.classList.add('not-blur');
    }

    ngOnInit() {
        this.$frame = this.el.nativeElement.firstChild;
        if (!this.config) this.config = this.db.ms.configs['default'];
        this.db.ms.onVisible.subscribe((value) => {
            this.visible = value;
        });
    }

    public set visible(value: boolean) {
        if (value != this.visible) {
            if (value) this.show();
            else this.hide();
        }
    }

    public get visible(): boolean {
        return this._visible;
    }

    private hide() {
        this.db.$elements.app.classList.remove('blur-content');
        this.$frame.classList.remove('shown');
        setTimeout(() => {
            this._visible = false;
            this.db.ms.hideCurrentModal();
        }, 500);
    }

    private show() {
        this.config = this.db.ms.configs[this.db.ms.currentModal] || this.db.ms.configs['default'];
        this.db.$elements.app.classList.add('blur-content');
        this._visible = true;
        setTimeout(() => {
            this.$frame.classList.add('shown');
        }, 100);
    }

    private _onEvent(data){
        this.db.ms.output = data;
    }
}
