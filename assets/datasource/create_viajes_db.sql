CREATE TABLE `viajes_dump` (
	`NumCuenta` VARCHAR(100) NULL DEFAULT NULL,
	`UR_Siglas` VARCHAR(100) NULL DEFAULT NULL,
	`Nom_SP` VARCHAR(100) NULL DEFAULT NULL,
	`No_Emp` VARCHAR(100) NULL DEFAULT NULL,
	`Cargo` VARCHAR(100) NULL DEFAULT NULL,
	`NivelCargo` VARCHAR(100) NULL DEFAULT NULL,
	`Estatus` VARCHAR(100) NULL DEFAULT NULL,
	`Correo` VARCHAR(100) NULL DEFAULT NULL,
	`Genero` VARCHAR(100) NULL DEFAULT NULL,
	`ObservacionesSP` VARCHAR(100) NULL DEFAULT NULL,
	`Nombre_Evento` VARCHAR(400) NULL DEFAULT NULL,
	`FechaInicio` VARCHAR(100) NULL DEFAULT NULL,
	`FechaFin` VARCHAR(100) NULL DEFAULT NULL,
	`URL_Evento` VARCHAR(100) NULL DEFAULT NULL,
	`Organizador_Evento` VARCHAR(300) NULL DEFAULT NULL,
	`PaisDestino` VARCHAR(100) NULL DEFAULT NULL,
	`EstadoDestino` VARCHAR(100) NULL DEFAULT NULL,
	`CiudadDestino` VARCHAR(100) NULL DEFAULT NULL,
	`ObservacionesEvento` VARCHAR(100) NULL DEFAULT NULL,
	`Num_Comision` VARCHAR(100) NULL DEFAULT NULL,
	`MecanismoCom` VARCHAR(100) NULL DEFAULT NULL,
	`InvitaSolicita` VARCHAR(200) NULL DEFAULT NULL,
	`UR_Nombre` VARCHAR(100) NULL DEFAULT NULL,
	`Obj_Estrategico` VARCHAR(100) NULL DEFAULT NULL,
	`Obj_Especifico` VARCHAR(100) NULL DEFAULT NULL,
	`Tema` VARCHAR(100) NULL DEFAULT NULL,
	`Motivo` TEXT NULL DEFAULT NULL,
	`Antecedentes` TEXT NULL DEFAULT NULL,
	`TipoViaje` VARCHAR(100) NULL DEFAULT NULL,
	`TipoRepresentaciomn` VARCHAR(100) NULL DEFAULT NULL,
	`TipoComision` VARCHAR(100) NULL DEFAULT NULL,
	`PaisOrigen` VARCHAR(100) NULL DEFAULT NULL,
	`EstadoOrigen` VARCHAR(100) NULL DEFAULT NULL,
	`CiudadOrigen` VARCHAR(100) NULL DEFAULT NULL,
	`FechaInicioParticipacion` VARCHAR(200) NULL DEFAULT NULL,
	`FechaFinParticipacon` VARCHAR(200) NULL DEFAULT NULL,
	`InstitucionPasaje` VARCHAR(200) NULL DEFAULT NULL,
	`InstitucionHospedaje` VARCHAR(200) NULL DEFAULT NULL,
	`InstitucionViaticos` VARCHAR(200) NULL DEFAULT NULL,
	`NoAcuerdo` VARCHAR(200) NULL DEFAULT NULL,
	`NoOficio` VARCHAR(200) NULL DEFAULT NULL,
	`Partida` VARCHAR(200) NULL DEFAULT NULL,
	`TipoPasaje` VARCHAR(200) NULL DEFAULT NULL,
	`AerolineaSalida` VARCHAR(200) NULL DEFAULT NULL,
	`NumVueloCorridaSalida` VARCHAR(200) NULL DEFAULT NULL,
	`FechaSalida` VARCHAR(200) NULL DEFAULT NULL,
	`AerolineaLlegada` VARCHAR(200) NULL DEFAULT NULL,
	`NumVueloCorridaLlegada` VARCHAR(200) NULL DEFAULT NULL,
	`FechaLlegada` VARCHAR(200) NULL DEFAULT NULL,
	`SolicitudCambio` VARCHAR(200) NULL DEFAULT NULL,
	`FechaSolicitudVuelo` VARCHAR(200) NULL DEFAULT NULL,
	`FechaCambioVuelo` VARCHAR(200) NULL DEFAULT NULL,
	`MotivoCambio` VARCHAR(200) NULL DEFAULT NULL,
	`MontoCambio` VARCHAR(200) NULL DEFAULT NULL,
	`GastoPasaje` VARCHAR(100) NULL DEFAULT NULL,
	`PartidaPresupuestaria` VARCHAR(200) NULL DEFAULT NULL,
	`FechaInicioViaticos` VARCHAR(200) NULL DEFAULT NULL,
	`FechaFinViaticos` VARCHAR(200) NULL DEFAULT NULL,
	`Moneda` VARCHAR(200) NULL DEFAULT NULL,
	`ValorTipoCambio` VARCHAR(200) NULL DEFAULT NULL,
	`Homologacion` VARCHAR(200) NULL DEFAULT NULL,
	`TarifaViaticos` VARCHAR(200) NULL DEFAULT NULL,
	`DiasViaticados` VARCHAR(200) NULL DEFAULT NULL,
	`MontoViaticados` VARCHAR(200) NULL DEFAULT NULL,
	`Observaciones` VARCHAR(200) NULL DEFAULT NULL,
	`Actividades_realizadas` VARCHAR(1200) NULL DEFAULT NULL,
	`Resultados` VARCHAR(1000) NULL DEFAULT NULL,
	`ContribucionesIFAI` VARCHAR(1500) NULL DEFAULT NULL,
	`Link` VARCHAR(200) NULL DEFAULT NULL,
	`NombreHotel` VARCHAR(200) NULL DEFAULT NULL,
	`FechaEntrada_1` VARCHAR(200) NULL DEFAULT NULL,
	`FechaSalida_1` VARCHAR(200) NULL DEFAULT NULL,
	`CostoHospedaje` VARCHAR(100) NULL DEFAULT NULL,
	`MontoComprobado` DECIMAL(10,2) NULL DEFAULT NULL,
	`MontoSinComprobar` DECIMAL(10,2) NULL DEFAULT NULL,
	`MontoDevuelto` DECIMAL(10,2) NULL DEFAULT NULL,
	`GastoTotalViaticos` DECIMAL(10,2) NULL DEFAULT NULL
)
COMMENT='test'
COLLATE='utf8_general_ci'
ENGINE=InnoDB;


CREATE TABLE `funcionario` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`institucion` VARCHAR(500) NOT NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`nombre` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`apellido_1` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`apellido_2` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`nombre_completo` VARCHAR(200) NOT NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`tipo_personal` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`cargo_nombre` VARCHAR(150) NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`cargo_nombre_superior` VARCHAR(150) NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`unidad_administrativa` VARCHAR(100) NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`clave_puesto` VARCHAR(100) NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`nombre_puesto` VARCHAR(100) NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`email` VARCHAR(100) NOT NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	`genero` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`id`),
	FULLTEXT INDEX `nombre_completo` (`nombre_completo`)
)
COLLATE='utf8_general_ci'
ENGINE=MyISAM
AUTO_INCREMENT=1;


insert into funcionario (institucion,nombre_completo) 
select distinct 'IFAI',Nom_SP 
from viajes_dump;

update funcionario f
left join viajes_dump v on
f.nombre_completo = v.Nom_SP
set 
	f.cargo_nombre = v.Cargo,f.tipo_personal = v.NivelCargo, f.email = v.Correo , f.genero = v.Genero;
	
CREATE TABLE `subscripcion` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`funcionario` INT(11) NOT NULL,
	`email` VARCHAR(200) NOT NULL,
	`lastUpdate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`funcionario`, `email`),
	INDEX `id` (`id`)
)
COMMENT='tabla de subscripciones a actualizaciones de funcionarios'
COLLATE='utf8_general_ci'
ENGINE=InnoDB;


CREATE TABLE `viaje` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`mec_origen` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`institucion_genera` VARCHAR(200) NOT NULL COLLATE 'utf8_general_ci',
	`UR` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`tipo_rep` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`consecutivo` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`nombre` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`cargo` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`grupo` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`tipo_viaje` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`acuerdo` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`oficio` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`pais_origen` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`estado_origen` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`ciudad_origen` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`pais_destino` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`estado_destino` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`ciudad_destino` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`tarifa_diaria` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`moneda` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`tema` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`tipo_com` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`evento` VARCHAR(500) NOT NULL COLLATE 'utf8_general_ci',
	`evento_url` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`motivo` TEXT NOT NULL COLLATE 'utf8_general_ci',
	`antecedente` VARCHAR(500) NOT NULL COLLATE 'utf8_general_ci',
	`actividad` TEXT NOT NULL COLLATE 'utf8_general_ci',
	`resultado` VARCHAR(500) NOT NULL COLLATE 'utf8_general_ci',
	`contribucion_ifai` TEXT NOT NULL COLLATE 'utf8_general_ci',
	`url_comunicado` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`pasaje_cubre` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`pasaje_tipo` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`linea_origen` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`vuelo_origen` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`linea_regreso` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`vuelo_regreso` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`gasto_pasaje` DECIMAL(14,2) NULL DEFAULT NULL,
	`gasto_viatico` DECIMAL(14,2) NULL DEFAULT NULL,
	`gasto_total` DECIMAL(14,2) NOT NULL,
	`inst_hospedaje` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`hotel` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`fecha_inicio_part` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`fecha_fin_part` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`fecha_inicio_com` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`fecha_fin_com` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`fecha_inicio_hotel` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`fecha_fin_hotel` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`costo_hotel` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`viatico_comprobado` DECIMAL(10,0) NULL DEFAULT NULL,
	`viatico_sin_comprobar` DECIMAL(10,0) NULL DEFAULT NULL,
	`viatico_devuelto` DECIMAL(10,0) NULL DEFAULT NULL,
	`observaciones` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`funcionario` INT(11) NOT NULL DEFAULT '0',
	`origen_latitud` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`origen_longitud` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`destino_latitud` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`destino_longitud` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`id`),
	FULLTEXT INDEX `nombre` (`nombre`)
)
COLLATE='utf8_general_ci'
ENGINE=MyISAM
AUTO_INCREMENT=1;

insert into viaje (mec_origen,institucion_genera,UR,tipo_rep,consecutivo,nombre,tipo_viaje,acuerdo,oficio,pais_origen,estado_origen,ciudad_origen,pais_destino,estado_destino,ciudad_destino,tarifa_diaria,moneda,tema,tipo_com,evento,evento_url,motivo,antecedente,actividad,resultado,contribucion_ifai,url_comunicado,pasaje_cubre,pasaje_tipo,linea_origen,vuelo_origen,linea_regreso,vuelo_regreso,gasto_pasaje,gasto_viatico,gasto_total,inst_hospedaje,hotel,fecha_inicio_part,fecha_fin_part,fecha_inicio_com,fecha_fin_com,fecha_inicio_hotel,fecha_fin_hotel,costo_hotel,viatico_comprobado,viatico_sin_comprobar,viatico_devuelto,observaciones) 
select MecanismoCom,Organizador_Evento,UR_Siglas,TipoRepresentaciomn,Num_comision,Nom_SP,TipoViaje,NoAcuerdo,NoOficio,PaisOrigen,EstadoOrigen,CiudadOrigen,PaisDestino,EstadoDestino,CiudadDestino,TarifaViaticos,Moneda,Tema,TipoComision,Nombre_Evento,URL_Evento,Motivo,Antecedentes,Actividades_realizadas,Resultados,ContribucionesIFAI,Link,InstitucionPasaje,TipoPasaje,AerolineaSalida,NumVueloCorridaSalida,AerolineaLlegada,NumVueloCorridaLlegada,CAST(replace(GastoPasaje, ',', '') AS DECIMAL(14,2)),CAST(replace(GastoTotalViaticos, ',', '') AS DECIMAL(14,2)),CAST(replace(GastoPasaje, ',', '') AS DECIMAL(14,2))+CAST(replace(GastoTotalViaticos, ',', '') AS DECIMAL(14,2)),InstitucionHospedaje,NombreHotel,FechaInicioParticipacion,FechaFinParticipacon,FechaInicioViaticos,FechaFinViaticos,FechaEntrada_1,FechaSalida_1,CostoHospedaje,MontoComprobado,MontoSinComprobar,MontoDevuelto,Observaciones
from viajes_dump;

update viaje v 
inner join viajes_dump vd on v.fecha_inicio_part = vd.FechaInicioParticipacion and v.nombre = vd.Nom_SP
set 
	gasto_pasaje = CAST(replace(vd.GastoPasaje, ',', '') AS DECIMAL(14,2)),
	gasto_viatico = CAST(replace(vd.MontoViaticados, ',', '') AS DECIMAL(14,2)),
	gasto_total = CAST(replace(vd.GastoPasaje, ',', '') AS DECIMAL(14,2)) + CAST(replace(vd.MontoViaticados, ',', '') AS DECIMAL(14,2))

update viaje v
left join funcionario f on
v.nombre = f.nombre_completo
set 
	v.funcionario = f.Id;
	

	/*Querys de control*/
	
	
select funcionario,nombre,fecha_inicio_part,ciudad_destino,count(*) as total 
from viaje 
group by funcionario,nombre,fecha_inicio_part,ciudad_destino
having count(*) > 1

select linea_origen,count(*) as total 
from viaje 
where pasaje_tipo = 'Aéreo' and linea_origen != '' and linea_origen != 'No disponible' and linea_origen != 'Pendiente de captura' 
group by linea_origen

select tipo_viaje,count(*) total from viaje group by tipo_viaje




