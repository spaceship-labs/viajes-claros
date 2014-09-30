/**
 * FuncionarioController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
module.exports = {
	index : function(req,res){
        var id = req.param('id');
        Funcionario.findOne({ id : id}).exec(function(err,funcionario){
           Viaje.find({funcionario : id}).exec(function(err,viajes){
               if (err) {
                   console.log(err);
               } else {
                   var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                   res.view({ funcionario : funcionario,viajes : viajes,fullUrl : fullUrl });
               }
           });
        });

	},

  search : function(req,res){
    res.view();

  },
  

  statisticsJson : function(req,res) {
      Viaje.find().exec(function(e,viajes){
          if (e) res.json({ text : "error viajes por nombre",error : e });
          res.json(viajes);
          cb();
      });
  }
};