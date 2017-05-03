import {ElementRef, Directive, OnInit} from '@angular/core';

let jQuery = require('jquery');
let fileinput = require('fileinput');

@Directive({
    selector: '[x-file]',
})
export class XFile implements OnInit{
    constructor(public el:ElementRef) {}
    ngOnInit() {
        jQuery(this.el.nativeElement).fileinput({
            browseLabel: '',
            previewFileType: 'image',
            browseClass: 'redondo btn btn-green-club',
            browseIcon: '<i class="fa fa-folder-open-o"></i> ',
            showCaption: false,//mostra campo con la ruta del archivo
            showRemove: false,//boton de eliminar (inutil)
            showUpload: false,//boton para subir (inutil)
            showPreview: false,//preview en la parte de abajo
        });
    }
}