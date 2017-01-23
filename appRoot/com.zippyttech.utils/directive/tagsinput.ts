import {ElementRef, Directive, EventEmitter, OnInit} from "@angular/core";
import {FormControl} from "@angular/forms";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

declare var jQuery:any;
@Directive({
    selector: "[tags-input]",
    inputs:['control','prefix'],
    outputs:['instance']
})
export class TagsInput implements OnInit{
    public instance:any;
    public prefix:string;
    public control:FormControl;
    public inputFree:boolean;

    constructor(public el: ElementRef,public db: DependenciesBase) {
        this.instance = new EventEmitter();
        this.control = new FormControl([]);
    }
    ngOnInit(){
        let that=this;
        that.inputFree = that.db.myglobal.getParams(that.prefix+'_TAG_INPUT_FREE')=='true'?true:false;
        if(that.inputFree) {
            jQuery(this.el.nativeElement).tagsinput({});
        }
        else {
            jQuery(this.el.nativeElement).tagsinput(
                {
                    'tagClass': function(item) {
                        switch (item.id) {
                            case '0': return 'label label-blue cursor-pointer';
                            case '1': return 'label label-primary cursor-pointer';
                            case '2': return 'label label-danger label-important cursor-pointer';
                            case '3': return 'label label-success cursor-pointer';
                            case '4': return 'label label-default cursor-pointer';
                            case '5': return 'label label-warning cursor-pointer';
                        }
                    },
                    'itemTitle':function(item) {
                        return item.title;
                    },
                    'itemValue':function(item) {
                        return item.value;
                    }
                }
            );
        }

        that.control.setValue(jQuery(that.el.nativeElement).tagsinput('items'));
        this.instance.emit(this);
    }
    public addValue(data){
        jQuery(this.el.nativeElement).tagsinput('add', data);
    }
}