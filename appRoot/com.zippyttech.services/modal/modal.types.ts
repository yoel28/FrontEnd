import {ILocation} from "../../com.zippyttech.ui/components/locationPicker/locationPicker.component";

export type ModalParams = IModalDelete | IModalSave;

export interface IModalDelete{
    selectedData:any; //TODO:Create interfaces or classes for data structure
}

export interface IModalSave{
    model:any;
    afterRunning:()=>void;
}

export interface IModalLocation{
    locationParams: ILocation; //TODO: Developing -> content[missing, check]
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
        actions?: Array<{
            name: string;
            icon?: string;
            classes?: string;
            call:()=>void;
        }>
    }
}