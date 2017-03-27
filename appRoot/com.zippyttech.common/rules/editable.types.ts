import {Rule, IRule} from "./rule";

type placementOptions = 'top'|'bottom'|'right'|'left';

export interface IEditable extends IRule{
    placement?:placementOptions;
    inputclass?:string; //CSS class automatically applied to input
    highlight?:string; //Color used to highlight element after update. Implemented via CSS3 transition, works in modern browsers.
    showbuttons?:boolean;//Where to show buttons: left(true)|bottom|false Form without buttons is auto-submitted.
    defaultValue?:string; // Value that will be displayed in input if original field value is empty (null|undefined|'').
}

export class Editable extends Rule{

    constructor(rule:Object){
        super(rule);
    }

    set placement(value:placementOptions){
        (<IEditable>this.attributes).placement = value;
    }
    get placement():placementOptions{
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

    set defaultValue(value:string){
        (<IEditable>this.attributes).defaultValue = value;
    }
    get defaultValue():string{
        return this.attributes.defaultValue || null;
    }

}
