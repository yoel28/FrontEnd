(function (global) {
    System.config({
        // transpiler: 'ts',
        // typescriptOptions: {
        //     "target": "es5",
        //     "module": "commonjs",
        //     "moduleResolution": "node",
        //     "sourceMap": true,
        //     "emitDecoratorMetadata": true,
        //     "experimentalDecorators": true,
        //     "lib": ["es2015", "dom"],
        //     "noImplicitAny": true,
        //     "suppressImplicitAnyIndexErrors": true
        // },
        // meta: {
        //     'typescript': {
        //         "exports": "ts"
        //     }
        // },
        paths: {
            // paths serve as alias
            // 'npmR:': 'https://unpkg.com/',
            // 'npm:':  'https://unpkg.com/',
            'npmR:': 'node_modules/',
            'npm:': 'node_modules/',

            // 'npmR:': 'https://unpkg.com/',
        },
        map: {
            'app':'appRoot',
            // angular bundles
            '@angular/animations':          'npmR:@angular/animations/bundles/animations.umd.js',
            '@angular/animations/browser':  'npmR:@angular/animations/bundles/animations-browser.umd.js',
            '@angular/core':                'npmR:@angular/core/bundles/core.umd.js',
            '@angular/common':              'npmR:@angular/common/bundles/common.umd.js',
            '@angular/compiler':            'npmR:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser':    'npmR:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser/animations':     'npmR:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
            '@angular/platform-browser-dynamic':        'npmR:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http':            'npmR:@angular/http/bundles/http.umd.js',
            '@angular/router':          'npmR:@angular/router/bundles/router.umd.js',
            '@angular/router/upgrade':  'npmR:@angular/router/bundles/router-upgrade.umd.js',
            '@angular/forms':           'npmR:@angular/forms/bundles/forms.umd.js',
            '@angular/upgrade':         'npmR:@angular/upgrade/bundles/upgrade.umd.js',
            '@angular/upgrade/static':  'npmR:@angular/upgrade/bundles/upgrade-static.umd.js',

            // other libraries
            'rxjs':                      'npmR:rxjs',
            'ng2-translate':             'npmR:ng2-translate/bundles/ng2-translate.umd.js',
            'angularfire2':              'npm:angularfire2/bundles/angularfire2.umd.js',
            'angular2-qrcode':           'npmR:angular2-qrcode',
            'qrcode-generator':          'npmR:qrcode-generator/qrcode.js',
            'qrious':                    'npmR:qrious/dist/cjs/qrious.js',
            'canvas':                    'npmR:canvasjs/dist/jquery.canvasjs.js',
            'ng2-toasty':                'npmR:ng2-toasty/bundles/index.umd.js',
            'angular2-highcharts':       'npmR:angular2-highcharts',
            'highcharts':                'npmR:highcharts',
            'angular2-notifications':    'npmR:/angular2-notifications',

            //Dependencias
            'jquery':           'npm:jquery/dist/',
            'moment':           'npmR:moment/',
            'humanize':         'npmR:humanize-duration/',
            'editable':         'npmR:x-editable/dist/bootstrap3-editable/js/',
            'cropit':           'npmR:cropit/dist/',
            'fileinput':        'npmR:bootstrap-fileinput/js/',
            'daterangepicker':  'npmR:bootstrap-daterangepicker/',
            'knob':             'npmR:jquery-knob/dist/',
            'jqueryui':         'npmR:jqueryui/',
            'tagsinput':        'npmR:bootstrap-tagsinput/dist/',
            'inputmask':        'npmR:jquery.inputmask/',
            'bootstrap':        'npmR:bootstrap/dist/js/',
            'firebase':         'npmR:firebase/',
            'sockjs-client':    'npmR:sockjs-client/dist/',
            'stompjs':          'npmR:stompjs/lib/',

            //assets
            'colorpicker':  'assets/plugins/colorpicker/js/',
            'table2excel':  'assets/js/',
            'addresspicker':'assets/plugins/',
            'adminLTE':     'assets/js/',

        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main',
                defaultExtension: 'js',
                meta: {
                    './*.js': {
                        loader: 'systemjs-angular-loader.js'
                    }
                },
            },
            rxjs: {
                defaultExtension: 'js'
            },

            'angular2-highcharts': {
                main: './index.js',
                defaultExtension: 'js'
            },
            'highcharts': {
                // NOTE: You should set './highcharts.src.js' here
                // if you are not going to use <chart type="StockChart"
                main: './highstock.src.js',

                defaultExtension: 'js'
            },
            'angular2-notifications': { main: 'components.js', defaultExtension: 'js' },
            'angular2-qrcode':{
                defaultExtension: 'js',
            },

            //Dependencias
            'jquery': {
                main:'jquery.min',
                format: 'global',
                defaultExtension: 'js',
            },
            'moment': {
                main:'moment',
                format: 'global',
                exports:'moment',
                defaultExtension: 'js',
            },
            'humanize': {
                main:'humanize-duration',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'editable': {
                main:'bootstrap-editable.min',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'cropit': {
                main:'jquery.cropit',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'fileinput': {
                main:'fileinput.min',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'daterangepicker': {
                main:'daterangepicker',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'knob': {
                main:'jquery.knob.min',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'jqueryui': {
                main:'jquery-ui.min',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'tagsinput': {
                main:'bootstrap-tagsinput.min',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'inputmask': {
                main:'index',
                format: 'cjs',
                defaultExtension: 'js',
            },
            "bootstrap": {
                main:'bootstrap.min',
                format: 'global',
                defaultExtension: 'js',
            },
            "firebase": {
                main:'firebase',
                //format: 'cjs',
                // exports:'firebase',
                defaultExtension: 'js',
            },
            "sockjs-client": {
                main:'sockjs.min',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'stompjs': {
                main:'stomp.min',
                format: 'cjs',
                defaultExtension: 'js',
            },
            //asset
            'colorpicker': {
                main:'colorpicker',
                format: 'cjs',
                defaultExtension: 'js',
            },

            'table2excel': {
                main:'tableToCSV',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'addresspicker': {
                main:'jquery.ui.addresspicker',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'adminLTE': {
                main:'app',
                format: 'cjs',
                defaultExtension: 'js',
            },

        }
    });

})(this);