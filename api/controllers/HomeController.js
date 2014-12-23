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

    viajesJson : function(req,res) {
        var estado = req.param('estado');
        var dependencia = req.param('dependencia');
        var nombre = req.param('nombre');
        var totalViajes = 0;
        Viaje.find({groupBy : ['ciudad_destino','destino_latitud','destino_longitud'],sum : ['gasto_viatico','gasto_pasaje']}).exec(function(e,viajes) {
            if (e) {
                console.log(e);
                res.json({ text : "error",error : e });
            }
            Viaje.count().exec(function(e,total) {
                var resJson = {viajes:viajes,totalViajes:total};
                res.json(resJson);
            });
        });
    },

    viajesPorCiudadJson : function(req,res) {
        var ciudad = req.param('ciudad');
        Viaje.find({ ciudad_destino : ciudad }).populate('funcionario').exec(function(err,viajes) {
            if (err) res.json({ text : "error",error : err });
            res.json(viajes);
        });
    },

    statisticsJson : function(req,res) {
        var asyncTasks = [];
        var topFuncionariosCaros = [];
        var ciudadesVisitadas = [];
        var aerolineas = [];
        var viajesPorTipo = {};
        var hotelVisitado = [];
        var viajesPorMes = [];
        var viajesAereosTerrestres = [];
        var ultimosViajes = [];
        var top3viajesCaros = [];

        asyncTasks.push(function(cb){
            var query = "select viaje.funcionario,funcionario.nombre_completo,funcionario.cargo_nombre,funcionario.institucion,sum(viaje.gasto_viatico) as gasto_viatico,sum(viaje.gasto_pasaje) as gasto_pasaje,sum(viaje.gasto_total) as gasto_total " +
                "from viaje inner join funcionario on viaje.funcionario = funcionario.id " +
                "group by viaje.funcionario,funcionario.nombre_completo,funcionario.cargo_nombre,funcionario.institucion " +
                "order by sum(gasto_total) desc";
            Viaje.query(query,
                function(e,viajes){
                    if (e) res.json({ text : "error funcionarios caros",error : e });
                    topFuncionariosCaros = viajes;
                    cb();
                });
        });
        asyncTasks.push(function(cb){
            Viaje.query("select ciudad_destino,pais_destino,tipo_viaje,sum(gasto_total) as gasto_total,count(*) as total from viaje group by ciudad_destino,pais_destino,tipo_viaje order by count(*) desc",
                function(e,viajes){
                    if (e) res.json({ text : "error ciudades",error : e });
                    //Viaje.find({ groupBy: [ 'ciudad_destino','pais_destino' ], sum: [ 'gasto_total' ] }).exec(function(err,vi) {
                    //    if (err) res.json({ text : "error ciudades new group by",error : err });
                    //    console.log(vi);
                        ciudadesVisitadas = viajes;
                        cb();
                    //});
                });
        });
        asyncTasks.push(function(cb){
            Viaje.query("select linea_origen,count(*) as total from viaje where pasaje_tipo = 'Aéreo' and linea_origen != '' and linea_origen != 'No disponible' and linea_origen != 'Pendiente de captura' and linea_origen != 'No aplica' group by linea_origen",
                function(e,vo){
                    if (e) res.json({ text : "error aerolineas",error : e });
                    aerolineas = vo;
                    cb();
            });
        });
        asyncTasks.push(function(cb){
            Viaje.query("select tipo_viaje,count(*) total from viaje where tipo_viaje != '' group by tipo_viaje",function(e,vo){
                if (e) res.json({ text : "error internacionales-nacionales",error : e });
                viajesPorTipo = vo;
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
            Viaje.query("select hotel,ciudad_destino,pais_destino,sum(gasto_viatico) as gasto_viatico from viaje where hotel != 'No aplica' and hotel != 'No disponible' and hotel != '' group by hotel,ciudad_destino,pais_destino order by sum(gasto_viatico) desc limit 0,3",
                function(e,viajes){
                    if (e) res.json({ text : "error hoteles visitados",error : e });
                    hotelVisitado = viajes;
                    cb();
                });
        });

        asyncTasks.push(function(cb){
            Viaje.find({ sort : 'gasto_total desc',limit : 3}).populate('funcionario').exec(
                function(e,viajes){
                    if (e) res.json({ text : "error viajes caros",error : e });
                    top3viajesCaros = viajes;
                    cb();
                });
        });

        asyncTasks.push(function(cb){
            Viaje.find({ fecha_inicio_part : { '!' : 'No aplica' } ,sort: 'fecha_inicio_part DESC',limit : 3}).populate('funcionario').exec(
                function(e,viajes){
                    if (e) res.json({ text : "error ultimos viajes",error : e });
                    ultimosViajes = viajes;
                    cb();
                });
        });

        asyncTasks.push(function(cb){
            Viaje.query("select count(*) as total from viaje group by MONTH(STR_TO_DATE(fecha_inicio_part,'%m/%d/%Y'));",
                function(e,viajes){
                    if (e) res.json({ text : "error viajes por mes",error : e });
                    viajesPorMes = _.map(viajes,function(viaje){
                                    return viaje.total;
                                });
                    cb();
                });
        });


        async.parallel(asyncTasks,function(){
            var response = {
                funcionariosList : topFuncionariosCaros,
                ciudadesList : ciudadesVisitadas,
                aerolineasList : aerolineas,
                internacionalesList  : viajesPorTipo,
                hotelList : hotelVisitado,
                pasajesList : viajesAereosTerrestres,
                viajesCarosList : top3viajesCaros,
                ultimosViajesList : ultimosViajes,
                viajesPorMes : viajesPorMes
            };
            res.json(response);
        });

    },


};