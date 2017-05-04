export type ModalName = 'delete' | 'save' | 'filter' | 'location' | 'search';

export type ModalParamsType = any;

export interface IModalParams {
    model: any;
    onAfterClose?: () => void;
    extraParams?: ModalParamsType;
}
;

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