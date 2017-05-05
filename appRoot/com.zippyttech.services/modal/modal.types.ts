import {ISearchEvents} from "../../com.zippyttech.ui/components/search/search.component";
export type ModalName = 'delete' | 'save' | 'filter' | 'location' | 'search';

export type ModalParamsType = any;
export type TEventOutput = ISearchEvents;

export interface IModalParams {
    model: any;
    onAfterClose?: (data:TEventOutput) => void;
    extraParams?: ModalParamsType;
}

export interface IModalConfig {
    id: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    header?: {
        title: string,
        classes?: string
    };
    footer?: {
        btns?: Array<{
            name: string;
            icon?: string;
            classes?: string;
            exp?: string;
            call: () => void;
        }>
    }
}