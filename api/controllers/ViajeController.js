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
    }
};