/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
declare var System: any;

System.config({
  // transpiler: 'typescript',
  defaultJSExtensions: true,
  production: true,
  paths: {
    // paths serve as alias
    'npm:': 'node_modules/',
    'npmR:': 'node_modules/',
    //'npmR:': 'https://unpkg.com/',
    'app:': 'appRoot/',
  },
  // meta: {
  //   "google": {
  //     "build": false,
  // //      "loader": "systemjs-googlemaps"
  //   }
  // },
  // map tells the System loader where to look for things
  map: {
    // our app is within the app folder
    'app': 'appRoot/',
    'main': 'app:main.js',

    // angular bundles
    '@angular/core': 'npmR:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npmR:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npmR:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npmR:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npmR:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npmR:@angular/http/bundles/http.umd.js',
    '@angular/router': 'npmR:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'npmR:@angular/forms/bundles/forms.umd.js',
    '@angular/upgrade': 'npmR:@angular/upgrade/bundles/upgrade.umd.js',

    // other libraries
    'rxjs':                      'npmR:rxjs',
    'ng2-translate':             'npmR:ng2-translate/bundles/ng2-translate.umd.js',
    'angularfire2':              'npmR:angularfire2/bundles/angularfire2.umd.js',
    'angular2-qrcode':           'npm:angular2-qrcode',
    'qrcode-generator':          'npm:qrcode-generator/qrcode.js',
    'ng2-toasty':                'npmR:ng2-toasty/bundles/index.umd.js',
    'angular2-highcharts':       'npm:angular2-highcharts',
    'highcharts':                'npmR:highcharts',

    //Dependencias
    'jquery':           'npm:jquery/dist/',
    'moment':           'npmR:moment/',
    'humanize':         'npmR:humanize-duration/',
    'editable':         'npmR:x-editable/dist/bootstrap3-editable/js/',
    'cropit':           'npm:cropit/dist/',
    'fileinput':        'npm:bootstrap-fileinput/js/',
    'daterangepicker':  'npmR:bootstrap-daterangepicker/',
    'knob':             'npmR:jquery-knob/dist/',
    'jqueryui':         'npmR:jqueryui/',
    'tagsinput':        'npmR:bootstrap-tagsinput/dist/',
    'inputmask':        'npmR:jquery.inputmask/',
    'bootstrap':        'npmR:bootstrap/dist/js/',
    'firebase':         'npm:firebase/',
    'sockjs-client':    'npmR:sockjs-client/dist/',
    'stompjs':          'npmR:stompjs/lib/',


    //assets
    'colorpicker':'assets/plugins/colorpicker/js/',
    'table2excel':'assets/js/',
    'addresspicker':'assets/plugins/',
    'adminLTE':'assets/js/',




  },
  // packages tells the System loader how to load when no filename and/or no extension
  packages: {
    'app': { main: './main.js', defaultExtension: 'js' },
    'api' : { defaultExtension : 'js' },
    'rxjs': { defaultExtension: 'js' },
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


    //Dependencias
    'jquery': {
      main:'jquery.min',
      format: 'global',
      defaultExtension: 'js',
    },
    'moment': {
      main:'moment',
      format: 'global',
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
      format: 'cjs',
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


  },
  // meta: {
  //   'node_modules/jquery/dist/jquery0.min.js': {//
  //       format: 'global', // load this module as a global
  //       exports: 'prueba1', // the global property to take as the module value
  //       //scriptLoad: true
  //       deps: [
  //         'prueba1'
  //       ]
  //   }
  // }

});
