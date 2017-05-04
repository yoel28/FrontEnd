import {Directive, ElementRef, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';

export interface IParamsInputMask {

}
let jQuery = require('jquery');
let mask = require('inputmask');
let bootstrap = require('bootstrap');

@Directive({
    selector: '[input-mask]',
    inputs: ['control', 'rule', 'params'],
})
export class InputMask implements OnInit {
    private control: FormControl;
    private rule: any;
    private params: IParamsInputMask;

    constructor(public el: ElementRef, public db: DependenciesBase) {
        this.control = new FormControl();
    }

    ngOnInit() {
        this.checkParams();
        let currentType = this.rule['type'];

        switch (currentType) {
            case 'email' :
                this.loadTypeEmail();
                break;
            case 'phone' :
                this.loadTypePhone();
                break;
            case 'combodate' :
                if (this.rule.date == 'date')
                    this.loadTypeDate();
                if (this.rule.date == 'datetime')
                    this.loadTypeDateTime();
                break;
            case 'url' :
                this.loadTypeUrl();
                break;
            default :
                this.loadTypeDefault();
                break;
        }
    }

    oncomplete(event) {
        let value = event.target.value;
        if (value) {
            this.control.setValue(value);
            this.control.markAsTouched();
            return;
        }
        this.db.debugLog('Error: oncomplete null', this.rule);

    }

    onincomplete() {
        this.control.setValue(null);
        this.control.markAsTouched();
    }

    checkParams() {
        if (this.params) {

        }
        else {
            this.params = {
                min: 0,
                max: 100,
                readOnly: true,
                fontWeight: '900'
            }
        }
    }

    private loadTypeEmail() {
        jQuery(this.el.nativeElement).inputmask('A{1,20}@B{1,20}.a{2,3}[.a{1,3}]', {
            definitions: {
                'A': {validator: '[a-zA-Z0-9_.\-]'},
                'B': {validator: '[a-zA-Z0-9\-]'},
            },
            oncomplete: this.oncomplete.bind(this),
            onincomplete: this.onincomplete.bind(this)
        });
    }

    private loadTypePhone() {
        jQuery(this.el.nativeElement).inputmask('(99) 9999[9]-9999', {
            oncomplete: this.oncomplete.bind(this),
            onincomplete: this.onincomplete.bind(this)
        });
    }

    private loadTypeDate() {
        jQuery(this.el.nativeElement).inputmask('dd-mm-yyyy', {
            oncomplete: this.oncomplete.bind(this),
            onincomplete: this.onincomplete.bind(this)
        });
    }

    private loadTypeDateTime() {
        jQuery(this.el.nativeElement).inputmask('datetime',
            {
                oncomplete: this.oncomplete.bind(this),
                onincomplete: this.onincomplete.bind(this)
            }
        );
    }

    private loadTypeUrl() {
        jQuery(this.el.nativeElement).inputmask('Regex', {
            regex: '(http|ftp|https)://[a-z0-9A-Z]+(.)*',
            oncomplete: this.oncomplete.bind(this),
            onincomplete: this.onincomplete.bind(this)
        });
    }

    private loadTypeDefault() {
        this.db.debugLog('Error: type not found', this.rule);
    }


}