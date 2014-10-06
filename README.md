ViajesClaros

Requerimientos

Tener instalado sin algún orden especifico 
	-mysql server 5.5
	-node server 0.10.26	

Guia de instalacion

Descargar el proyecto

wget -O- https://github.com/el-sonny/viajes-claros

una vez descargado 

ejecutar  : npm install

una vez acabado este proceso

ejecutar : bower install

por ultimo entrar a la carpeta dump/ dentro del proyecto descargardo

ejecutar : mysql u usuario p < viajestransparentes.sql

una vez creada la base de datos hay que configurar la coneccion a mysql en el archivo /config/connections.js  y cambiar la línea de conneccion o agregarla como esta aquí indicada

'mysql-connection': {
    adapter: 'sails-mysql',
    host: my_db_host',
    user: 'my_db_user',
    password: my_db_password',
    database: 'viajestransparentes'
  },


Por ultimo para levantar el servidor ejecutar 

Sais lift 


