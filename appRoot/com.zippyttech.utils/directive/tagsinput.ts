import {Directive, ElementRef, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';
import {ModelRoot} from '../../com.zippyttech.common/modelRoot';
import {TRules} from '../../app-routing.module';

let jQuery = require('jquery');
let tagsinput = require('tagsinput');

type TTemplate = 'free' | 'object' | 'inlist'
interface Itest {
    a: string;
}
interface IProperties {
    /*
    * Classname for the tags, or a function returning a classname
    * */
    tagClass?: ((item: any) => string) | string;
    /*
    * When adding objects as tags,
    * itemValue must be set to the name of the property containing the item's value,
    * or a function returning an item's value.
    * */
    itemValue?: ((item: any) => string) | string;
    /*
    * When adding objects as tags,
    * you can set itemText to the name of the property of item to use for a its tag's text,
    * You may also provide a function which returns an item's value. When this options is not set,
    * the value of itemValue will be used
    * */
    itemText?: ((item: any) => string) | string;
    /*
    * array of keycodes which will add a tag when typing in the input. (default: [13, 188],
    * which are ENTER and comma)
    * */
    confirmKeys?: number[];
    /*
    * When set, no more than the given number of tags are allowed to add (default: undefined).
    * When maxTags is reached, a class 'bootstrap-tagsinput-max' is placed on the tagsinput element.
    * */
    maxTags?: number;
    /*
    * Defines the maximum length of a single tag. (default: undefined)
    * */
    maxChars?: number;
    /*
    * When true, automatically removes all whitespace around tags. (default: false)
    * */
    trimValue?: boolean;
    /*
    * When true, the same tag can be added multiple times. (default: false)
    * */
    allowDuplicates?: boolean;
    /*
    * When the input container has focus,
    * the class specified by this config option will be applied to the container
    * */
    focusClass?: string;
    /*
    * allow creating tags which are not returned by typeahead's source (default: true).
    * This is only possible when using string as tags. When itemValue option is set, this option will be ignored.
    * */
    freeInput?: boolean
    /*
    * Object containing typeahead specific options
    * */
    typeahead?: {
        /*
        * an array (or function returning a promise or array), which will be used as source for a typeahead.
        * */
        source: (value: any) => (string[] | Promise<any>) | string[];
    };
    /*
    * Boolean value controlling whether form submissions get
    * processed when pressing enter in a field converted to a tagsinput (default: false).
    * */
    cancelConfirmKeysOnEmpty?: boolean;
    /*
    * Function invoked when trying to add an item which allready exists. By default,
    * the existing tag hides and fades in.
    * */
    onTagExists?: (item: any, $tag: any) => any;
}

interface IEvents {}

export interface ITagsInput {
    template?: TTemplate;
    inputFree?: boolean;
    instance: TagsInput;
    properties: IProperties
    events?: IEvents
}


@Directive({
    selector: '[tags-input]',
    inputs: ['model', 'key', 'control'],
})
export class TagsInput implements OnInit {

    public model: ModelRoot;
    public key: string;
    public control: FormControl;

    private _$tag: any;

    constructor(public el: ElementRef, public db: DependenciesBase) {
        this.control = new FormControl([]);
    }

    ngOnInit() {
        this._$tag = jQuery(this.el.nativeElement);
        let list = this._rule.list;
        switch (list.template) {
            case 'free':
                break;
            case 'inlist':
                break;
            case 'object':
                break;
            default:
        }
        this._$tag.tagsinput(this._rule.list.properties);


        // jQuery(this.el.nativeElement).tagsinput(
        //     {
        //         'tagClass': function(item) {
        //             switch (item.id) {
        //                 case '1': return 'label label-green cursor-pointer';
        //                 case '2': return 'label label-danger label-important cursor-pointer';
        //                 case '3': return 'label label-success cursor-pointer';
        //                 case '4': return 'label label-default cursor-pointer';
        //                 case '5': return 'label label-warning cursor-pointer';
        //                 default: return 'label label-blue cursor-pointer';
        //             }
        //         },
        //         'itemTitle':function(item) {
        //             return item.title;
        //         },
        //         'itemValue':function(item) {
        //             return item.value;
        //         }
        //     }
        // );
        this._evItemAdded();
        this._evItemRemoved();
    }


    // region other

    private get _rule(): TRules {
        return this.model.rules[this.key] || {};
    }

    private _fnUpdateValue() {
        this.control.setValue(this._$tag.tagsinput('items'));
    }

    // endregion

    // region methods tags

    fnAdd(value: any) {
        this._$tag.tagsinput('add', value);
    }

    fnRemove(value: any) {
        this._$tag.tagsinput('remove', value);
    }

    fnRemoveAll(value: any) {
        this._$tag.tagsinput('removeAll');
    }

    fnFocus() {
        this._$tag.tagsinput('focus');
    }

    fnRefresh() {
        this._$tag.tagsinput('refresh');
    }

    fnDestroy() {
        this._$tag.tagsinput('destroy');
    }

    // endregion

    // region events tags

    private _evItemAdded() {
        this._$tag.on('itemAdded', (event) => {
            this._fnUpdateValue();
        });
    }

    private _evItemRemoved() {
        this._$tag.on('itemRemoved', (event) => {
            this._fnUpdateValue();
        });
    }

    // endregion
}