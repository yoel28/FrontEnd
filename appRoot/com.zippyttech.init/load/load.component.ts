import {Component, OnDestroy, OnInit} from '@angular/core';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';

@Component({
    selector: 'load-page',
    templateUrl: './index.html',
    styleUrls: ['./style.css']
})
export class LoadComponent implements OnInit, OnDestroy {

    public subscribe: any;

    constructor(public db: DependenciesBase) {

    }

    ngOnInit(): void {
        let that = this;
        this.subscribe = this.db.myglobal.dataSesion.valueChanges.subscribe(
            (value: string) => {
                that.onLoadPage();
            }
        );
        if (localStorage.getItem('bearer')) {
            if (this.db.myglobal.dataSesion.valid)
                this.onLoadPage();
            else
                this.db.myglobal.initSession();
        }
    }

    public onLoadPage() {
        if (this.db.myglobal.dataSesion.valid) {
            if (!this.db.myglobal.saveUrl || (this.db.myglobal.saveUrl && this.db.myglobal.saveUrl == '/'))
                this.db.myglobal.saveUrl = '/init/dashboard';
            let link = [this.db.myglobal.saveUrl, {}];
            this.db.myglobal.saveUrl = null;
            this.db.router.navigate(link);
        }
    }

    ngOnDestroy(): void {
        this.subscribe.unsubscribe();
    }

}


