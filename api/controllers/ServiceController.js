/**
 * Created by Owner on 9/27/2014.
 */
var async = require('async');
var request = require('request');
var moment = require('moment');
var json2csv = require('json2csv');

module.exports = {
    updateFuncionariosViajes: function (req, res) {
        Viaje.find({ funcionario: 0 }).exec(function (err, viajes) {
            async.forEach(viajes, function (viaje, callback) {
                var nombres = viaje.nombre.split(" ");
                var query = "select id,nombre_completo from funcionario where match (funcionario.nombre_completo) against ('+" + nombres.join(" +") + "' IN BOOLEAN MODE)";
                Funcionario.query(query, function (err, funcionarios) {
                    if (funcionarios.length) {
                        viaje.funcionario = funcionarios[0].id;
                        viaje.save(callback);
                    } else {
                        var funcionario = {
                            institucion: "INSTITUTO FEDERAL DE ACCESO A LA INFORMACIÓN Y PROTECCIÓN DE DATOS ORGANISMO AUTÓNOMO en proceso de reestructuración",
                            nombre_completo: viaje.nombre.toLowerCase()
                        };
                        Funcionario.create(funcionario).exec(function (err, fitem) {
                            viaje.funcionario = fitem.id;
                            viaje.save(callback);
                        });
                    }
                })
            }, function (err) {
                res.json(err);
            });
        });
    },

    updateLongitudViajes: function (req, res) {
        Viaje.find({limit: 10, skip: 30}).exec(function (err, viajes) {
            async.forEach(viajes, function (viaje, callback) {
                var url = "http://maps.google.com/maps/api/geocode/json?address=" + viaje.ciudad_destino + "&components=country:" + viaje.pais_destino + "|administrative_area:" + viaje.estado_destino;
                request({ url: url, json: true }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        if (body.results && body.results.length > 0) {
                            viaje.destino_latitud = body.results[0].geometry.location.lat;
                            viaje.destino_longitud = body.results[0].geometry.location.lng;
                            viaje.save(callback);
                        } else {
                            console.log("error :" + url);
                        }

                    }
                });
            }, function (err) {
                console.log("finish");
                res.json({text: "success!", err: err});
            });

        });
    },

    subscribe: function (req, res) {
        var email = req.param('email');
        var funcionario = req.param('funcionario');

        Subscription.find({ email: email }).populate('funcionario').exec(function (err, subscriptions) {
            if (err) return console.error(err);
            var found = false;
            if (subscriptions.length > 0) {
                for (var i = 0; i < subscriptions.length; i++) {
                    if (funcionario == subscriptions[i].funcionario.id) {
                        found = subscriptions[i];
                        return res.json({ text: "ya esta agregado" });
                    }
                }
            } else {
                Subscription.create({ funcionario: funcionario, email: email }).exec(function (err, subscription) {
                    if (err) {
                        return console.error(err);
                    }
                    return res.json({ text: "agregado" });
                });

            }
            if (found) {
                Subscription.create({ funcionario: funcionario, email: email }).exec(function (err, subscription) {
                    if (err) {
                        return console.error(err);
                    }
                    return res.json({ text: "agregado" });
                });
            }
        });
    },

    datos: function (req, res) {
        var query = "SELECT UPDATE_TIME FROM information_schema.tables WHERE TABLE_SCHEMA = 'viajestransparentes' AND TABLE_NAME = 'viaje'";
        Viaje.query(query, function (err, viajeUpdateTime) {
            if (err) console.log(err);
            var query = "SELECT UPDATE_TIME FROM information_schema.tables WHERE TABLE_SCHEMA = 'viajestransparentes' AND TABLE_NAME = 'funcionario'";
            Funcionario.query(query, function (err, funcionarioUpdateTime) {
                if (err) console.log(err);
                res.view({
                    viajeUpdateTime : moment(viajeUpdateTime[0].UPDATE_TIME).format("DD-MM-YYYY HH:mm"),
                    funcionarioUpdateTime : moment(funcionarioUpdateTime[0].UPDATE_TIME).format("DD-MM-YYYY HH:mm")});
            });
        });

    },

    funcionarios_json : function(req,res) {

    },

    funcionarios_csv : function(req,res) {
        Funcionario.find().exec(function(err, list){
            if (err) console.log(err);
            // Send a CSV response
            var config = {
                fields : ['institucion',
                    'nombre',
                    'apellido_1',
                    'apellido_2',
                    'nombre_completo',
                    'tipo_personal',
                    'cargo_nombre',
                    'cargo_nombre_superior',
                    'unidad_administrativa',
                    'clave_puesto',
                    'nombre_puesto',
                    'email'],
                data: list
            };

            json2csv(config, function(err, csv) {
                if (err) console.log(err);
                var filename = "funcionarios.csv";
                res.attachment(filename);
                res.end(csv, 'UTF-8');
            });

        });
    },

    viajes_csv : function(req,res) {
        Viaje.find().exec(function(err, list){
            if (err) console.log(err);
            // Send a CSV response
            var config = {
                fields : ['mec_origen',
                    'institucion_genera',
                    'UR',
                    'tipo_rep',
                    'consecutivo',
                    'nombre',
                    'cargo',
                    'grupo',
                    'tipo_viaje',
                    'acuerdo',
                    'oficio',
                    'pais_origen',
                    'estado_origen',
                    'ciudad_origen',
                    'pais_destino',
                    'estado_destino',
                    'ciudad_destino',
                    'tarifa_diaria',
                    'moneda',
                    'tema',
                    'tipo_com',
                    'evento',
                    'evento_url',
                    'motivo',
                    'antecedente',
                    'actividad',
                    'resultado',
                    'contribucion_ifai',
                    'url_comunicado',
                    'pasaje_cubre',
                    'pasaje_tipo',
                    'linea_origen',
                    'vuelo_origen',
                    'linea_regreso',
                    'vuelo_regreso',
                    'gasto_pasaje',
                    'gasto_viatico',
                    'inst_hospedaje',
                    'hotel',
                    'fecha_inicio_part',
                    'fecha_fin_part',
                    'fecha_inicio_com',
                    'fecha_fin_com',
                    'fecha_inicio_hotel',
                    'fecha_fin_hotel',
                    'costo_hotel',
                    'viatico_comprobado',
                    'viatico_sin_comprobar',
                    'viatico_devuelto',
                    'observaciones' ],
                data: list
            };

            json2csv(config, function(err, csv) {
                if (err) console.log(err);
                var filename = "viajes.csv";
                res.attachment(filename);
                res.end(csv, 'UTF-8');
            });

        });
    },

    viajes_json : function(req,res) {
        Viaje.find().exec(function(err, list){
            if (err) console.log(err);
            res.attachment();
        });
    }

};
