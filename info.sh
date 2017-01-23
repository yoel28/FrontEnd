#!/bin/bash

url="http://vertedero.aguaseo.com:8080/api/infos/";
token="9hf31a08306q7pv6gtv4gtul4bt3jaqv";

declare -A prefix;

prefix[0]="EVENT";
prefix[1]="INFO";
prefix[2]="NOTIFY";
prefix[3]="PARAM";
prefix[4]="RULE";

prefix[5]="ACCOUNT";
prefix[6]="ROLE";
prefix[7]="USER";
prefix[8]="PERM";


for (( i=0; i<$((${#prefix[@]})); i++ ));
do
   for (( j=1; j<=10; j++ ));
   do
	curl -k -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $token" -X POST -d "{'code':'${prefix[$i]}_${j}','title':'Titulo default ${prefix[$i]}_${j}','color':'0e1c40','position':'left','size':'fa-lg','icon':'fa fa-question-circle','detail':'Contenido default ${prefix[$i]}_${j}'}" $url;
   done
done
