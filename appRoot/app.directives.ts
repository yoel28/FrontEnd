import {ColorPicker} from './com.zippyttech.utils/directive/colorPicker';
import {XEditable} from './com.zippyttech.utils/directive/xEditable';
import {XCropit} from './com.zippyttech.utils/directive/xCropit';
import {XFile} from './com.zippyttech.utils/directive/xFile';
import {DatePicker} from './com.zippyttech.utils/directive/datePicker';
import {SmDropdown} from './com.zippyttech.utils/directive/smDropDown';
import {DateRangePicker} from './com.zippyttech.utils/directive/dateRangePicker';
import {TagsInput} from './com.zippyttech.utils/directive/tagsinput';
import {XFootable} from './com.zippyttech.utils/directive/xFootable';
import {Knob} from './com.zippyttech.utils/directive/knob';
import {InputMask} from './com.zippyttech.utils/directive/inputMask';

export const directivesDefault = [
    ColorPicker,
    XEditable,
    XCropit,
    XFile,
    DatePicker,
    SmDropdown,
    DateRangePicker,
    TagsInput,
    XFootable,
    Knob,
    InputMask
];
export const directivesApp = [];
export function abs(): string {
    // return '/home/zippyttech/Documentos/WebStorm/default2';
    return '';
}

export function appPath(): any {
    return {
        'access': abs() + '/appRoot/com.zippyttech.access/',
        'auth': abs() + '/appRoot/com.zippyttech.auth/',
        'business': abs() + '/appRoot/com.zippyttech.business/',
        'init': abs() + '/appRoot/com.zippyttech.init/',
        'ui': abs() + '/appRoot/com.zippyttech.ui/',
        'baseView': abs() + '/appRoot/com.zippyttech.ui/view/base/'
    }
}