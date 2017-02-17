//type:'text'|'number'|'date'|'list'|'boolean'|'image'|'location';
export interface IRules{
    [key:string]: IText | INumber
}

interface IDefault{
    key?:string;
    title?:string;
    placeholder?:string;
    required?:boolean;
    exclude?:boolean;
    update?:boolean;
    visible?:boolean;
}
export interface IText extends IDefault{
    type:'text';
    email?:boolean;
}
interface INumber extends IDefault{
    type:'number';
    step?:string;
}
export interface IImage extends IDefault{
    type:'image';
    default?:string;
}

abstract class prueba{
    private field1:string;
    public field2:string;
}

function  prueba1(){
    let data:IRules={};
}