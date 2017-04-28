import {Rule, IRule} from "./rule";

type TPlacement = 'top'|'bottom'|'right'|'left';
type TMode = 'popup' | 'inline';

export interface IEditable extends IRule{
    placement?:TPlacement;
    inputclass?:string; //CSS class automatically applied to input
    highlight?:string; //Color used to highlight element after update. Implemented via CSS3 transition, works in modern browsers.
    showbuttons?:boolean;//Where to show buttons: left(true)|bottom|false Form without buttons is auto-submitted.
    emptytext?:string; // Value that will be displayed in input if original field value is empty (null|undefined|'').
    mode?:TMode;
}

export class Editable extends Rule{

    constructor(rule:Object){
        super(rule);
    }

    set placement(value:TPlacement){
        (<IEditable>this.attributes).placement = value;
    }
    get placement():TPlacement{
        return this.attributes.placement || 'top';
    }

    set inputClass(value:string){
        (<IEditable>this.attributes).inputclass = value;
    }
    get inputClass():string{
        return this.attributes.inputclass || '';
    }

    set highlight(value:string){
        (<IEditable>this.attributes).highlight = value;
    }
    get highlight():string{
        return this.attributes.highlight || '#FFFF80';
    }

    get showbuttons():boolean{
        return this.attributes.showbuttons || false;
    }
    set showbuttons(value:boolean){
        this.attributes.showbuttons = value;
    }

    set emptyText(value:string){
        (<IEditable>this.attributes).emptytext = value;
    }
    get emptyText():string{
        return this.attributes.emptytext || null;
    }

    set mode(value:TMode){
        (<IEditable>this.attributes).mode = value;
    }
    get mode():TMode{
        return this.attributes.mode || null;
    }

}
