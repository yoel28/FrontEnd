#!/bin/bash

url="https://cdg.zippyttech.com:8080/api/permissions/";
token="bk3ifapcpe8l03g6iq1su5md5efg29et";#dev

#url="https://club.zippyttech.com:8080/api/permissions/";
#token="9hf31a08306q7pv6gtv4gtul4bt3jaqv";

#Otros------------------------------------------------------------------------------------------------------------------------------------------------------------------------
declare -A Otros;
#Default
Otros[0,0]="ACL_SAVE";	                Otros[0,1]="ACL";           Otros[0,2]="Guardar acl";       Otros[0,3]="permission";    Otros[0,4]="addAllToRole";      Otros[0,5]="Guardar acl"
Otros[1,0]="ACCESS_CONTEXT";	        Otros[1,1]="Acceso";        Otros[1,2]="Contexto";          Otros[1,3]="access";        Otros[1,4]="level1";            Otros[1,5]="permite al usuario un acceso al contexto de la compañía"
Otros[2,0]="ACCESS_GLOBAL";	            Otros[2,1]="Acceso";        Otros[2,2]="Global";            Otros[2,3]="access";        Otros[2,4]="level2";            Otros[2,5]="permite al usuario estar en un nivel de vista global"
Otros[3,0]="USER_ROLE_SAVE";	        Otros[3,1]="Usuarios";      Otros[3,2]="Actualizar Roles";  Otros[3,3]="userRole";      Otros[3,4]="save";              Otros[3,5]="Actualizar roles de usuarios"


#PREFIX			    Modulo          Titulo			    Controlador         accion              detail
#Otros[0,0]="";	    Otros[0,1]="";	Otros[0,2]="";      Otros[0,3]="";      Otros[0,4]="";      Otros[0,5]="";
for (( i=0; i<$((${#Otros[@]}/6)); i++ ));
do
	echo -e "\n\n${Otros[$i,0]}---${Otros[$i,1]}\n";
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Otros[$i,0]}','module':'${Otros[$i,1]}','title':'${Otros[$i,2]}','controlador':'${Otros[$i,3]}','accion':'${Otros[$i,4]}','detail':'${Otros[$i,5]}'}"  -k $url
done

#Menu------------------------------------------------------------------------------------------------------------------------------------------------------------------------
declare -A Menu;
Menu[0,0]="MEN_DASHBOARD";              Menu[0,1]="Dashboard";
Menu[1,0]="MEN_USERS";                  Menu[1,1]="Usuarios";
Menu[2,0]="MEN_ACL";                    Menu[2,1]="ACL";
Menu[3,0]="MEN_PERM";                   Menu[3,1]="Permisos";
Menu[4,0]="MEN_ROLE";                   Menu[4,1]="Roles";
Menu[5,0]="MEN_ACCOUNT";                Menu[5,1]="Cuentas";
Menu[6,0]="MEN_EVENT";                  Menu[6,1]="Eventos";
Menu[7,0]="MEN_INFO";                   Menu[7,1]="Información";
Menu[8,0]="MEN_PARAM";                  Menu[8,1]="Parámetros";
Menu[9,0]="MEN_RULE";                   Menu[9,1]="Reglas";
Menu[10,0]="MEN_NOTIFY";                Menu[10,1]="Notificaciones";
Menu[11,0]="MEN_CHANNEL";               Menu[11,1]="Canales";


#PREFIX			    Title
#Menu[0,0]="";	    Menu[0,1]="";
for (( i=0; i<$((${#Menu[@]}/2)); i++ ));
do
	echo -e "\n\n${Menu[$i,0]}---${Menu[$i,1]}\n";
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Menu[$i,0]}','module':' menu izquierda','title':'${Menu[$i,1]}','controlador':'','accion':'','detail':'Enlace a ${Menu[$i,1]}'}"  -k $url
done

#Modulos-------------------------------------------------------------------------------------------------------------------------------------
declare -A Modulos;

#business-------------------------------------------------------------------------------------------------------------------------------------
Modulos[0,0]="EVENT";		Modulos[0,1]="Eventos";				Modulos[0,2]="event";
Modulos[1,0]="INFO";		Modulos[1,1]="Informacion";			Modulos[1,2]="info";
Modulos[2,0]="NOTIFY";		Modulos[2,1]="Notificaciones";		Modulos[2,2]="notification";
Modulos[3,0]="PARAM";		Modulos[3,1]="Parametros";			Modulos[3,2]="param";
Modulos[4,0]="RULE";		Modulos[4,1]="Reglas";				Modulos[4,2]="rule";
#access------------------------------------------------------------------------------------------------------------------------------------
Modulos[5,0]="ACCOUNT";		Modulos[5,1]="Cuentas";				Modulos[5,2]="account";
Modulos[6,0]="ROLE";		Modulos[6,1]="Roles";				Modulos[6,2]="role";
Modulos[7,0]="USER";		Modulos[7,1]="Usuarios";			Modulos[7,2]="user";
Modulos[8,0]="CH";	    	Modulos[8,1]="Canales";			    Modulos[8,2]="channel";
Modulos[9,0]="PERM";		Modulos[9,1]="Permisos";			Modulos[9,2]="permission";

#PREFIX			    Modulo			    Controlador
#Modulos[0,0]="";	Modulos[0,1]="";	Modulos[0,2]="";
for (( i=0; i<$((${#Modulos[@]}/3)); i++ ));
do
	echo -e "\n\n${Modulos[$i,0]}---${Modulos[$i,1]}---${Modulos[$i,2]}\n";
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_SHOW_DELETED'   ,'module':'${Modulos[$i,1]}','title':'Ver eliminados'       ,'controlador':'${Modulos[$i,2]}','accion':''      ,'detail':'Ver eliminados'}"                     -k $url
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_EXPORT'         ,'module':'${Modulos[$i,1]}','title':'Exportar'             ,'controlador':'${Modulos[$i,2]}','accion':''      ,'detail':'Exportar data en pdf/xls'}"           -k $url
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_LIST'           ,'module':'${Modulos[$i,1]}','title':'Listar'               ,'controlador':'${Modulos[$i,2]}','accion':'index' ,'detail':'Listar elementos'}"                   -k $url
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_UPDATE'         ,'module':'${Modulos[$i,1]}','title':'Actualizar'           ,'controlador':'${Modulos[$i,2]}','accion':'update','detail':'Actualizar elementos'}"               -k $url
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_DELETE'         ,'module':'${Modulos[$i,1]}','title':'Eliminar'             ,'controlador':'${Modulos[$i,2]}','accion':'delete','detail':'Borrar elementos'}"                   -k $url
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_FILTER'         ,'module':'${Modulos[$i,1]}','title':'Filtrar'              ,'controlador':'${Modulos[$i,2]}','accion':''      ,'detail':'Filtrar elementos'}"                  -k $url
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_SEARCH'         ,'module':'${Modulos[$i,1]}','title':'Buscar'               ,'controlador':'${Modulos[$i,2]}','accion':'search','detail':'Buscar elementos'}"                   -k $url
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_LOCK'           ,'module':'${Modulos[$i,1]}','title':'Bloquear'             ,'controlador':'${Modulos[$i,2]}','accion':'lock'  ,'detail':'Bloquear elementos'}"                 -k $url
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_WARNING'        ,'module':'${Modulos[$i,1]}','title':'Advertencia'          ,'controlador':'${Modulos[$i,2]}','accion':''      ,'detail':'Ocultar mensaje de advertencia'}"     -k $url
	curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_AUDIT'          ,'module':'${Modulos[$i,1]}','title':'Auditar'              ,'controlador':'${Modulos[$i,2]}','accion':'audit' ,'detail':'Auditoria de elementos'}"             -k $url
    curl  -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${Modulos[$i,0]}_ADD'            ,'module':'${Modulos[$i,1]}','title':'Agregar'              ,'controlador':'${Modulos[$i,2]}','accion':'save'  ,'detail':'Guardar elementos'}"                  -k $url
done


 



