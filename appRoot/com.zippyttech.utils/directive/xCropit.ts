import {ElementRef, Directive, EventEmitter, OnInit} from "@angular/core";

declare var jQuery:any;

@Directive({
    selector: "[x-cropit]",
    inputs: ['imageSrc'],
    outputs:   ['saveImagen'],
})
export class XCropit implements OnInit{
    public saveImagen:any;
    public imageSrc:string;
    constructor(public el:ElementRef) {
        this.saveImagen = new EventEmitter();
    }
    ngOnInit() {
        let that = jQuery(this.el.nativeElement);
        let _this = this;
        that.find('.cropit-preview').css({
            'background-color': '#f8f8f8',
            'background-size': 'cover',
            'border': '1px solid #ccc',
            'border-radius': '3px',
            'margin-top': '7px',
            'width': '150px',
            'height': '150px',
        });
        that.find('.cropit-preview-image-container').css({'cursor': 'move'});
        that.find('.image-size-label').css({'margin-top': '10px'});
        that.find('input, .export').css({'display':'block'});
        that.find('button').css({'margin-top':'10px'});

        that.cropit({
            onImageLoaded:function () {
                let imageData = that.cropit('export');
                if(imageData)
                    _this.saveImagen.emit(imageData);
            },
            onOffsetChange:function () {
                let imageData = that.cropit('export');
                if(imageData)
                    _this.saveImagen.emit(imageData);
            },
            imageState: { src: _this.imageSrc || "" }
        });
        that.find('.rotate-cw').click(function(event) {
            event.preventDefault();
            that.cropit('rotateCW');
            let imageData = that.cropit('export');
            if(imageData)
                _this.saveImagen.emit(imageData);
        });
        that.find('.rotate-ccw').click(function(event) {
            event.preventDefault();
            that.cropit('rotateCCW');
            let imageData = that.cropit('export');
            if(imageData)
                _this.saveImagen.emit(imageData);
        });
    }
}