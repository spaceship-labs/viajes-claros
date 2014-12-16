/**
 * Created by Owner on 9/29/2014.
 */
module.exports = {
    index : function(req,res){
        var id = req.param('id');
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        if (id) {
            Viaje.findOne({id : id}).populate('funcionario').exec(function(err,viaje){
                if (err) {
                    console.log(err);
                    res.forbidden();
                } else {
                    if(viaje){
                        Viaje.find({ evento : viaje.evento }).populate('funcionario').exec(function(err,viajesExtras) {
                            if (err) {
                                console.log(err);
                                res.forbidden();
                            }
                            res.view({ 
                                funcionario : viaje.funcionario,viaje : viaje,
                                fullUrl : fullUrl,
                                viajes : viajesExtras,
                                title : 'Detalles del viaje de ' + viaje.funcionario.nombre_completo,
                                description : 'Consulta el viaje a '+viaje.ciudad_destino+' de '+viaje.funcionario.nombre_completo+' - @ifaimexico vía @viajesclaros #ViajesClaros'
                            });
                        });
                    }
                    else{
                        res.redirect('/');
                    }
                }
            });
        } else {
            res.forbidden();
        }
    },
    list : function(req,res) {
        var request = req.param('request');
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        var asyncTasks = [];
        asyncTasks.push(function(cb){
            Viaje.query("select distinct pais_destino,estado_destino,ciudad_destino  from viaje",
                function(e,d){
                    if (e) res.json({ text : "error destinos",error : e });
                    destinos = d;
                    cb();
                });
        });
        asyncTasks.push(function(cb){
            Viaje.query("select distinct tema from viaje",
                function(e,t){
                    if (e) res.json({ text : "error temas",error : e });
                    temas = t;
                    cb();
                });
        });
        asyncTasks.push(function(cb){
            Viaje.query("select distinct tipo_com from viaje",
                function(e,c){
                    if (e) res.json({ text : "error tipo comisiones",error : e });
                    comiciones = c;
                    cb();
                });
        });

        Viaje.find().exec(function(err,viajes){
            if (err) {
                console.log(err);
                return;
            }
            async.parallel(asyncTasks,function(){
                var catalog = {
                    destinosCatalogo : destinos,
                    temasCatalogo : temas,
                    comisionCatalogo : comiciones
                };

                res.view('viaje/search',{
                    viajes : viajes,
                    fullUrl : fullUrl,
                    title : 'Viajes Claros',
                    description : Common.viajesRequestToString(request),
                    request : request || {},
                    catalog : catalog
                });
            });
        });
    },
    searchtipo : function(req,res){
        var term = req.param('filtro');
        var title = '';
        if (term) {
            Viaje.find({ 'tipo_viaje' : { 'like' : "%" + term + "%" }}).exec(function(err,viajes) {
                if (err) console.log(err);
                if(viajes){
                    title = 'Todos los viajes ' + term + 'es';
                    res.view(
                        'viaje/search',
                        { viajes : viajes || [],term : term, title : title}
                    );
                }else{
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    },
    searchmedio : function(req,res){
        var term = req.param('filtro');
        var title = '';
        if (term) {
            Viaje.find({ 'pasaje_tipo' : { 'like' : "%" + term + "%" }}).exec(function(err,viajes) {
                if (err) console.log(err);
                if(viajes){
                    title = 'Todos los viajes ' + term + 's';
                    res.view(
                        'viaje/search',
                        { viajes : viajes || [],term : term, title : title}
                    );
                }else{
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    },
    search_hotel : function(req,res){
        var term = req.param('filtro');
        var title = '';
        var prefix = (term.indexOf('hotel') > -1) ? '' : 'hotel ';
        if (term) {
            Viaje.find({ 'hotel' : { 'like' : "%" + term + "%" }}).exec(function(err,viajes) {
                if (err) console.log(err);
                if(viajes){
                    title = 'Viajes en los que se ha usado el ' + prefix + term;
                    res.view(
                        'viaje/search',
                        { viajes : viajes || [],term : term, title : title}
                    );
                }else{
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    },
    search_ciudad : function(req,res){
        var term = req.param('filtro');
        var title = '';
        if (term) {
            Viaje.find({ 'ciudad_destino' : { 'like' : "%" + term + "%" }}).exec(function(err,viajes) {
                if (err) console.log(err);
                if(viajes){
                    title = 'Todos los viajes a ' + term;
                    res.view(
                        'viaje/search',
                        { viajes : viajes || [],term : term , title : title}
                    );
                }else{
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    }
};
