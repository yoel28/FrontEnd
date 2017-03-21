import {ILocation} from "../../com.zippyttech.ui/components/locationPicker/locationPicker.component";

export type ModalName = 'delete' | 'save';

export interface IModalParams<ParamsType extends IModalParamsType>{
    model:any;
    extraParams?:ParamsType;
    onAfterClose?:()=>void;
};

export interface IModalParamsType{}

export interface IModalDelete extends IModalParamsType{
    selectedData:any; //TODO: Define DATATYPE, create DATA struct
}

export interface IModalSave{
    childKey:string;
}

export interface IModalLocation{
    location: ILocation;
}

export interface IModalRule{}

export interface IModalSearch{}

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