/**
 * FuncionarioController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
module.exports = {
	index : function(req,res){
        var id = req.param('id');
        Funcionario.findOne({ id : id}).populate('viajes').exec(function(err,funcionario){
               if (err) {
                   console.log(err);
               } else {
                   var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                   res.view({ funcionario : funcionario,viajes : funcionario.viajes,fullUrl : fullUrl });
               }
        });

	},

  search : function(req,res){
    var term = req.param('filtro');
      if (term) {
          Funcionario.find({ nombre_completo : { 'like' : "%" + term + "%" }}).populate('viajes').exec(function(err,funcionarios) {
              if (err) console.log(err);
              res.view({ funcionarios : funcionarios || [],term : term});
          });
      } else {
        res.forbidden();
      }


  },
  

  statisticsJson : function(req,res) {
      Viaje.find().exec(function(e,viajes){
          if (e) res.json({ text : "error viajes por nombre",error : e });
          res.json(viajes);
          cb();
      });
  }
};