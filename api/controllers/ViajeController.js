/**
 * Created by Owner on 9/29/2014.
 */
module.exports = {
    index : function(req,res){
        var id = req.param('id');
        if (!id) {
            res.forbidden();
        }
        Viaje.findOne({id : id}).populate('funcionario').exec(function(err,viaje){
            if (err) {
                console.log(err);
                throw err;
            } else {
                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                res.view({ funcionario : viaje.funcionario,viaje : viaje,fullUrl : fullUrl });
            }
        });

    }
};