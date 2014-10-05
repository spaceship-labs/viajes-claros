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
                    Viaje.find({ evento : viaje.evento,funcionario : { '!' : viaje.funcionario.id } }).populate('funcionario').exec(function(err,viajesExtras) {
                        if (err) {
                            console.log(err);
                            res.forbidden();
                        }
                        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                        res.view({ funcionario : viaje.funcionario,viaje : viaje,fullUrl : fullUrl,viajes : viajesExtras });
                    });
                }
            });
        } else {
            res.forbidden();
        }
    },
    searchtipo : function(req,res){
        var term = req.param('filtro');
        var title = '';
        if (term) {
            Viaje.find({ 'tipo_viaje' : { 'like' : "%" + term + "%" }}).exec(function(err,viajes) {
                if (err) console.log(err);
                title = 'Todos los viajes ' + term + 'es';
                res.view(
                    'viaje/search',
                    { viajes : viajes || [],term : term, title : title}
                );
            });
        } else {
            res.forbidden();
        }
    },
    searchmedio : function(req,res){
        var term = req.param('filtro');
        var title = '';
        if (term) {
            Viaje.find({ 'pasaje_tipo' : { 'like' : "%" + term + "%" }}).exec(function(err,viajes) {
                if (err) console.log(err);
                title = 'Todos los viajes ' + term + 's';
                res.view(
                    'viaje/search',
                    { viajes : viajes || [],term : term, title : title}
                );
            });
        } else {
            res.forbidden();
        }
    },
    search_hotel : function(req,res){
        var term = req.param('filtro');
        var title = '';
        var prefix = (term.indexOf('hotel') > -1) ? '' : 'hotel ';
        if (term) {
            Viaje.find({ 'hotel' : { 'like' : "%" + term + "%" }}).exec(function(err,viajes) {
                if (err) console.log(err);
                title = 'Viajes en los que se ha usado el ' + prefix + term;
                res.view(
                    'viaje/search',
                    { viajes : viajes || [],term : term, title : title}
                );
            });
        } else {
            res.forbidden();
        }
    },
    search_ciudad : function(req,res){
        var term = req.param('filtro');
        var title = '';
        if (term) {
            Viaje.find({ 'ciudad_destino' : { 'like' : "%" + term + "%" }}).exec(function(err,viajes) {
                if (err) console.log(err);
                title = 'Todos los viajes a ' + term;
                res.view(
                    'viaje/search',
                    { viajes : viajes || [],term : term , title : title}
                );
            });
        } else {
            res.forbidden();
        }
    },
};
