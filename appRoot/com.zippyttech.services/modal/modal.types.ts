import {ILocation} from "../../com.zippyttech.ui/components/locationPicker/locationPicker.component";

export type ModalName = 'delete' | 'save';

export interface IModalParams<ParamsType extends IModalParamsType>{
    model:any;
    onAfterClose?:()=>void;
    extraParams?:ParamsType;
};

export interface IModalParamsType{}

export interface IModalDelete extends IModalParamsType{}

export interface IModalSave extends IModalParamsType{
    childKey:string;
}

export interface IModalLocation extends IModalParamsType{
    location: ILocation;
}

export interface IModalSearch{}

export interface IModalRule{}


export interface IModalConfig{
    id:string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    header?:{
        title:string,
        classes?:string
    };
    body?:{ }; //TODO: define body params
    footer?:{
        btns?: Array<{
            name: string;
            icon?: string;
            classes?: string;
            call:()=>void;
        }>
    }
}