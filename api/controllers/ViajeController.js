/**
 * Created by Owner on 9/29/2014.
 */
module.exports = {
    index : function(req,res){
        var id = req.param('id');
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
                            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                            res.view({ 
                                funcionario : viaje.funcionario,viaje : viaje,
                                fullUrl : fullUrl,
                                viajes : viajesExtras,
                                title : 'Detalles del viaje de ' + viaje.funcionario.nombre_completo,
                                description : viaje.evento,
                            });
                        });
                    }
                    else{
                        res.redirect('/');
                    }
                }
            });
        } else {
            res.redirect('/');
        }
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
    },
};
