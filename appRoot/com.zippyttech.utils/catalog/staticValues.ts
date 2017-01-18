declare var moment:any;
declare var Table2Excel:any;
declare var humanizeDuration:any;

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

        msg.error = "El campo contiene errores";
        msg.required = "Este campo es obligatorio";
        msg.noAuthorized = "No posee permisos para esta accion";
        msg.object = "La referencia no esta registrada";
        msg.email = "Correo electronico invalido";
        msg.notFound = "No se encontraron resultados";
        msg.warningTitle = "Advertencia";
        msg.warningBody = "El cambio de estas configuraciones avanzadas puede ser perjudicial para la estabilidad, la seguridad y el rendimiento de esta aplicación. Sólo se debe continuar si está seguro de lo que hace.";
        msg.warningButtonExit = "Salir";
        msg.warningButtonYes = "Sí, estoy seguro";
        msg.fieldRequired = "Todos los campos con (*) son obligatorios.";
        msg.contactAdminPermission = "contacte al administrador para activar el permiso";
        msg.delete = "Eliminar";
        msg.activate="Cuenta Activada";
        msg.errorActivate="Error al activar la cuenta";
        msg.pleaseWait="Por favor espere";
        msg.activeUser="Activar usuario";
        msg.login="INICIAR SESIÓN";
        msg.recoverPassword="¿Olvidó su contraseña? Haz click aquí";
        msg.titleRecoverPassword="Recuperar contraseña";
        msg.start="Inicio";
        msg.recover="Recuperar";
        msg.pleaseEnterEmailOrUserValid="Por favor ingrese un correo o usuario válido";
        msg.pleaseEnterPassword="Por favor ingrese una contraseña";
        msg.sendEmail="Correo enviado";
        msg.processedRequest="Solicitud Procesada";
        msg.profile="Perfil";
        msg.save="Guardar";
        msg.update="Actualizar";
        msg.imageEditor="Editor de imagenes";
        msg.imageEdit="Editar imagen";
        msg.getProducts="Recepción de productos";
        msg.clickChange="Click para cambiar";
        msg.add="Agregar";
        msg.find="Buscar";
        msg.introValueFind="Ingrese valor para buscar";
        msg.findData="Buscando información, por favor espere";
        msg.close="Cerrar";
        msg.selectOption="Seleccione una opción";
        msg.notAuthorized="Acceso no autorizado";
        msg.select="Seleccionar";
        msg.config="Configuración";
        msg.refresh="Actualizar";

        return msg;

    }

}