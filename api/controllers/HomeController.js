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

    vajesJson : function(req,res) {
        var estado = req.param('estado');
        var dependencia = req.param('dependencia');
        var nombre = req.param('nombre');
        Viaje.find({groupBy : ['ciudad_destino','destino_latitud','destino_longitud'],sum : ['gasto_viatico','gasto_pasaje']}).exec(function(e,viajes) {
            if (e) res.json({ text : "error",error : e });
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
            var query = "select viaje.funcionario,funcionario.nombre_completo,funcionario.cargo_nombre,funcionario.unidad_administrativa,sum(viaje.gasto_viatico) as gasto_viatico,sum(viaje.gasto_pasaje) as gasto_pasaje,sum(viaje.gasto_total) as gasto_total " +
                "from viaje inner join funcionario on viaje.funcionario = funcionario.id " +
                "group by viaje.funcionario,funcionario.nombre_completo,funcionario.cargo_nombre,funcionario.unidad_administrativa " +
                "order by sum(gasto_total) desc";
            Viaje.query(query,
                function(e,viajes){
                    if (e) res.json({ text : "error viajes por nombre",error : e });
                    viajesPorNombre = viajes;
                    cb();
                });
        });
        asyncTasks.push(function(cb){
            Viaje.query("select ciudad_destino,pais_destino,tipo_viaje,sum(gasto_total) as gasto_total,count(*) as total from viaje group by ciudad_destino,pais_destino,tipo_viaje order by count(*) desc,sum(gasto_total) desc",
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
                hotelList : hotelVisitado
            };
            res.json(response);
        });

    },


};