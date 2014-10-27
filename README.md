#ViajesClaros

##Requerimientos

Tener instalado sin algún orden especifico 
	-mysql server 5.5
	-node server 0.10.26
	-bower
	-npm

##Guia de instalacion

Descargar el proyecto

wget -O- https://github.com/el-sonny/viajes-claros

una vez descargado 

ejecutar: 

npm install

una vez acabado este proceso

ejecutar: 

bower install

por ultimo entrar a la carpeta dump/ dentro del proyecto descargardo

ejecutar: 
mysql u usuario p < viajestransparentes.sql

una vez creada la base de datos hay que configurar la coneccion a mysql en el archivo /config/local.js y generar el archivo de coniguracion

module.exports = {
	connections:{
		'mysql-connection' : {
		    adapter: 'sails-mysql',
		    host: my_db_host',
		    user: 'my_db_user',
		    password: my_db_password',
		    database: 'viajestransparentes'
		},
	}
};

Por ultimo para levantar el servidor ejecutar 

Sais lift ó node app.js

##API

http://viajestransparentes.node.spaceshiplabs.com/viaje/find
http://viajestransparentes.node.spaceshiplabs.com/funcionario/find

Puedes usar opciones como where, skip, limit, skip sort y callback (JSONP) o cualquiera de los atributos.

para ver un registro individual

/:modelo/:id

Ejemplos:

http://viajestransparentes.node.spaceshiplabs.com/viaje/find?tipo_viaje=Internacional&limit=1000
http://viajestransparentes.node.spaceshiplabs.com/viaje/14
http://viajestransparentes.node.spaceshiplabs.com/funcionario/find?nombre_puesto=%20JEFE%20DE%20DEPARTAMENTO