var jQuery = require('jquery');
var moment = require('moment');
var humanizeDuration = require('humanize');
var Table2Excel = require('table2excel');

export class StaticValues {

    public static dateHmanizer = humanizeDuration.humanizer({
        language: 'shortEs',
        round: true,
        languages: {
            shortEs: {
                y: function () {
                    return 'y'
                },
                mo: function () {
                    return 'm'
                },
                w: function () {
                    return 'Sem'
                },
                d: function () {
                    return 'd'
                },
                h: function () {
                    return 'hr'
                },
                m: function () {
                    return 'min'
                },
                s: function () {
                    return 'seg'
                },
                ms: function () {
                    return 'ms'
                },
            }
        }
    });

    //lista de rangos disponibles
    public static get itemsDate():any {
        return [
            {'id': '1', 'text': 'Hoy'},
            {'id': '2', 'text': 'Semana actual'},
            {'id': '3', 'text': 'Mes actual'},
            {'id': '4', 'text': 'Mes anterior'},
            {'id': '5', 'text': 'Últimos 3 meses'},
            {'id': '6', 'text': 'Año actual'},
        ];
    }

    public static get formatDateDDMMYYYY():any
    {
        return {'format': "DD-MM-YYYY", "minDate": "01-01-2016"};
    }

    public static get formatDatePickerDDMMYYYY():any
    {
        return {
            'format': 'dd/mm/yyyy',
            'formatView':'DD/MM/YYYY, LT',
            'startDate': '01/01/2016',
            'startView': 2,
            'minViewMode': 0,
            'maxViewMode': 2,
            'forceParse': false,
            'language': "es",
            'todayBtn': "linked",
            'autoclose': true,
            'todayHighlight': true,
            'return': 'DD/MM/YYYY'
        }
    }
    public static get formatDatePickerDDMMYYYYLT():any
    {
        return {
            'format': 'dd/mm/yyyy, LT',
            'formatView': 'DD/MM/YYYY, LT',
            'startDate': '01/01/2016',
            'startView': 2,
            'minViewMode': 0,
            'maxViewMode': 2,
            'forceParse': false,
            'language': "es",
            'todayBtn': "linked",
            'autoclose': true,
            'todayHighlight': true,
            'return': 'DD/MM/YYYY'
        }
    }

    public static get formatDatePickerDDMMYYYY2():any
    {
        return {
            'format': 'dd/mm/yyyy',
            'startDate': '01/01/2016',
            'startView': 2,
            'minViewMode': 0,
            'maxViewMode': 2,
            'forceParse': false,
            'language': "es",
            'todayBtn': "linked",
            'autoclose': true,
            'todayHighlight': true,
            'return': 'YYYY-MM-DD'
        }
    }

    public static get pathElements(){
        return{
            'isotipo':          'assets/img/default/zippy/isotipo.png',
            'isotipoMini':      'assets/img/default/zippy/isotipo-mini.png',
            'favicon':          'assets/img/default/zippy/favicon.png',
            'isotipo-blanco':   'assets/img/default/zippy/isotipo-blanco.png',
            'logo':             'assets/img/clubGolf/logo.png',
            'logoBlanco':       'assets/img/clubGolf/logo.png',
            'robot':            'assets/img/default/zippy/robot.png',
            'warning':          'assets/img/default/warning.png',
            'company':          'assets/img/default/varios/company.png',
            'qr':               'assets/img/clubGolf/qr.jpg',
            'miniLogo':         'assets/img/clubGolf/miniLogo.png',


            'btnCarrito':         'assets/img/clubGolf/botones/carrito.png',
            'btnFamilia':         'assets/img/clubGolf/botones/familia.png',
            'btnInvitados':       'assets/img/clubGolf/botones/invitados.png',
            'btnServicios':       'assets/img/clubGolf/botones/servicios.png',
            'btnToallas':         'assets/img/clubGolf/botones/toallas.png',
            'btnUsuario':         'assets/img/clubGolf/botones/usuario.png',
        }
    }

    public static get msg():any
    {
        let msg:any = {};

        msg.error = "El campo contiene errores***";
        msg.object = "La referencia no esta registrada***";
        msg.email = "Correo electronico invalido***";
        msg.delete = "Eliminar***";
        msg.activate="Cuenta Activada***";
        msg.errorActivate="Error al activar la cuenta***";
        msg.login="INICIAR SESIÓN***";
        msg.recoverPassword="¿Olvidó su contraseña? Haz click aquí***";
        msg.pleaseEnterEmailOrUserValid="Por favor ingrese un correo o usuario válido***";
        msg.pleaseEnterPassword="Por favor ingrese una contraseña***";
        msg.sendEmail="Correo enviado***";
        msg.processedRequest="Solicitud Procesada***";
        msg.save="Guardar***";
        msg.update="Actualizar***";
        msg.imageEditor="***";
        msg.imageEdit="Editar imagen***";
        msg.getProducts="Recepción de productos***";
        msg.clickChange="Click para cambiar***";
        msg.add="Agregar***";
        msg.notAuthorized="Acceso no autorizado***";
        msg.refresh="Actualizar***";
        msg.exportPdf="Exportar a pdf***";
        msg.exportXls="Exportar a excel***";
        msg.savePreferences="***";
        msg.address="Dirección***";
        msg.zoom="Zoom***";
        msg.exportDisabled="No se puede generar el reporte, limite de ***";
        msg.page="Pagina ***";
        msg.rows="filas ***";
        msg.results="resultados***";
        msg.imageError="Por favor ingrese una imagen valida***";
        msg.listError="Lista vacia***";
        msg.errorMaxlength="El campo debe ser menor a $0 caracteres***";
        msg.errorMinlength="El campo debe ser mayor a $0 caracteres***";

        return msg;

    }
    public static msgParams(id:string,params:Array<string | number> = [])
    {
        let currentMsg = this.msg[id];
        params.forEach((value,index)=>{
            currentMsg.replace('$'+index,value)
        })
        return currentMsg;
    }

}