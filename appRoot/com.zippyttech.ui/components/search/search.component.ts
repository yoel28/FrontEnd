import {Component, EventEmitter, OnInit, DoCheck} from '@angular/core';
import {RestController} from "../../../com.zippyttech.rest/restController";
import {DependenciesBase} from "../../../com.zippyttech.common/DependenciesBase";
declare var SystemJS:any;
@Component({
    selector: 'search-view',
    templateUrl: SystemJS.map.app+'/com.zippyttech.ui/components/search/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.ui/components/search/style.css'],
    inputs:['params'],
    outputs:['result','getInstance'],
})
export class SearchComponent extends RestController implements OnInit,DoCheck{

    // Parametro de entrada
    // public searchVehiculo={
    //     title:"Vehiculo",
    //     idModal:"searchVehiculo",
    //     endpoint:"/search/vehicles/",
    //     placeholder:"Ingrese la placa",
    //     label:{name:"Nombre: ",detail:": "},
    //     where:&where[['op':'eq','field':'vehicle','value':'IsNull']]
    // }

    public params:any={};
    public result:any;
    public getInstance:any;

    constructor(public db:DependenciesBase) {
        super(db);
        this.result = new EventEmitter();
        this.getInstance = new EventEmitter();
    }
    ngOnInit(){
        this.max = 5;
        this.setEndpoint(this.params.endpoint);
    }
    ngDoCheck():void{
        this.getInstance.emit(this);
    }
    getSearch(search){
        this.endpoint=this.params.endpoint+search;
        this.where = this.params.where || "";
        this.loadData();
    }
    getData(data){
        this.result.emit(data);
    }
}

