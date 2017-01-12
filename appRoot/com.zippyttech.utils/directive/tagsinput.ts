import {ElementRef, Directive, EventEmitter, OnInit} from "@angular/core";
import {FormControl} from "@angular/forms";

declare var jQuery:any;
@Directive({
    selector: "[tags-input]",
    inputs:['control'],
    outputs:['instance']
})
export class TagsInput implements OnInit{
    public instance:any;
    public control:FormControl;

    constructor(public el: ElementRef) {
        this.instance = new EventEmitter();
        this.control = new FormControl([]);
    }
    ngOnInit(){
        let that=this;
        jQuery(this.el.nativeElement).tagsinput({
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
            'itemValue': 'value'
        });

        that.control.setValue(jQuery(that.el.nativeElement).tagsinput('items'));
        jQuery(this.el.nativeElement).on('itemAdded', function(event) {
            console.log(that.control.value);
        });
        jQuery(this.el.nativeElement).on('itemRemoved', function(event) {
            console.log(that.control.value);
        });

        this.instance.emit(this);
    }
    public addValue(data){
        jQuery(this.el.nativeElement).tagsinput('add', data);
    }
}