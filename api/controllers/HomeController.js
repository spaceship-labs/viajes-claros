/**
 * HomeController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var async = require('async');

module.exports = {
	index : function(req,res){
        res.view();
	},

    aviso : function(req,res){
        res.view();
    },

    vajesJson : function(req,res) {
        var estado = req.param('estado');
        var dependencia = req.param('dependencia');
        var nombre = req.param('nombre');
        var totalViajes = 0;
        Viaje.count().exec(function(e,total) {
            totalViajes = total;
        });
        Viaje.find({groupBy : ['ciudad_destino','destino_latitud','destino_longitud'],sum : ['gasto_viatico','gasto_pasaje']}).exec(function(e,viajes) {
            if (e) res.json({ text : "error",error : e });
            var resJson = {viajes:viajes,totalViajes:totalViajes};
            res.json(resJson);
        });
    },

    vajesPorCiudadJson : function(req,res) {
        var ciudad = req.param('ciudad');
        Viaje.find({ ciudad_destino : ciudad }).populate('funcionario').exec(function(err,viajes) {
            if (err) res.json({ text : "error",error : err });
            res.json(viajes);
        });
    },

    statisticsJson : function(req,res) {
        var asyncTasks = [];
        var viajesPorNombre = [];
        var ciudadesVisitadas = [];
        var aerolineas = [];
        var viajesInternacionalesNacionales = {};
        var hotelVisitado = [];

        asyncTasks.push(function(cb){
            var query = "select viaje.funcionario,funcionario.nombre_completo,funcionario.nombre_puesto,funcionario.cargo_nombre_superior,sum(viaje.gasto_viatico) as gasto_viatico,sum(viaje.gasto_pasaje) as gasto_pasaje,sum(viaje.gasto_total) as gasto_total " +
                "from viaje inner join funcionario on viaje.funcionario = funcionario.id " +
                "group by viaje.funcionario,funcionario.nombre_completo,funcionario.nombre_puesto,funcionario.cargo_nombre_superior " +
                "order by sum(gasto_total) desc";
            Viaje.query(query,
                function(e,viajes){
                    if (e) res.json({ text : "error viajes por nombre",error : e });
                    viajesPorNombre = viajes;
                    cb();
                });
        });
        asyncTasks.push(function(cb){
            Viaje.query("select ciudad_destino,pais_destino,tipo_viaje,sum(gasto_total) as gasto_total,count(*) as total from viaje group by ciudad_destino,pais_destino,tipo_viaje order by count(*) desc",
                function(e,viajes){
                    if (e) res.json({ text : "error ciudades",error : e });
                    ciudadesVisitadas = viajes;
                    cb();
                });
        });
        asyncTasks.push(function(cb){
            Viaje.query("select linea_origen,count(*) as total from viaje where pasaje_tipo = 'Aéreo' and linea_origen != '' group by linea_origen",
                function(e,vo){
                    if (e) res.json({ text : "error aerolineas",error : e });
                    aerolineas = vo;
                    cb();
            });
        });
        asyncTasks.push(function(cb){
            Viaje.query("select tipo_viaje,count(*) total from viaje where tipo_viaje != '' group by tipo_viaje",function(e,vo){
                if (e) res.json({ text : "error internacionales-nacionales",error : e });
                viajesInternacionalesNacionales = vo;
                cb();
            });
        });
        asyncTasks.push(function(cb){
            Viaje.query("select pasaje_tipo,count(*) total from viaje where pasaje_tipo != '' group by pasaje_tipo",function(e,vo){
                if (e) res.json({ text : "error terrestres-aereos",error : e });
                viajesAereosTerrestres = vo;
                cb();
            });
        });
        asyncTasks.push(function(cb){
            Viaje.query("select hotel,ciudad_destino,pais_destino,sum(gasto_viatico) as gasto_viatico from viaje where hotel != 'No aplica' and hotel != 'No disponible' group by hotel,ciudad_destino,pais_destino order by sum(gasto_viatico) desc limit 0,3",
                function(e,viajes){
                    if (e) res.json({ text : "error hoteles",error : e });
                    hotelVisitado = viajes;
                    cb();
                });
        });


        async.parallel(asyncTasks,function(){
            var response = {
                funcionariosList : viajesPorNombre,
                ciudadesList : ciudadesVisitadas,
                aerolineasList : aerolineas,
                internacionalesList  : viajesInternacionalesNacionales,
                hotelList : hotelVisitado,
                pasajesList : viajesAereosTerrestres
            };
            res.json(response);
        });

    },


};