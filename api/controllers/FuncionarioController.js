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
            if (err){ 
                console.log(err);
            }
            if(funcionario){
                Viaje.find({ funcionario : id }).exec(function(err,viajes) {
                    if (err) {
                        console.log(err);
                    } else {
                        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                        res.view({ 
                          funcionario : funcionario,
                          viajes : viajes || [],
                          fullUrl : fullUrl,
                          title : funcionario.nombre_completo,
                        });
                    }
                });
            }else{
                res.redirect('/');
            }

        });

	},

    search : function(req,res){
        var term = req.param('filtro');
          if (term) {
              Funcionario.find({ nombre_completo : { 'like' : "%" + term + "%" }}).populate('viajes').exec(function(err,funcionarios) {
                  if (err) console.log(err);
                  if(funcionarios){
                      res.view({ funcionarios : funcionarios || [],term : term});                    
                  }else{
                    res.redirect('/');
                  }
              });
          } else {
            res.redirect('/');
          }
    },

    search_autocomplete : function(req,res){
        var term = req.param('nombre');
        Funcionario.find({ nombre_completo : { 'like' : "%" + term + "%" }}).exec(function(err,funcionarios) {
            if (err) console.log(err);
            if(funcionarios){
                res.json(funcionarios);
            }
        });
    },

    statisticsJson : function(req,res) {
        Viaje.find().exec(function(e,viajes){
            if (e) res.json({ text : "error viajes por nombre",error : e });
            res.json(viajes);
            cb();
        });
    },

    list : function(req,res){
        var page = req.param('page');
        page = (!isNaN(page)) ? page : 1;
        if(page){
            Funcionario.find()
            .populate('viajes')
            .paginate({page: page, limit: 10})
            .sort('nombre_completo asc')
            .exec(function(err,funcionarios) {
                if (err) console.log(err);
                Funcionario.count().exec(function(error,count){
                    var siteUrl = req.protocol + '://' + req.get('host'); 
                    res.view({ funcionarios : funcionarios || [] , count : count , page : page, siteUrl : siteUrl});
                });
            });
        } else{
            res.redirect('/');
        }
    },
    comparar : function(req,res){
        var func_uno_id = req.param('first_id');
        var func_dos_id = req.param('second_id');
        if(!isNaN(func_uno_id) && !isNaN(func_dos_id)){
            var ids = [func_uno_id,func_dos_id];
            var funcionarios_arr = [];
            ids.forEach(function(elem,index){
                var funcionario_tmp = {};
                var x = 0;
                Funcionario.findOne({ id : elem}).populate('viajes').exec(function(err,funcionario){
                    if (err) console.log(err);
                    if(funcionario){
                        funcionarios_arr.push(funcionario);
                        if(index == ids.length-1){
                            res.view({funcionarios : funcionarios_arr});
                        }
                    }else{
                        res.redirect('/');
                    }
                });
            });  

        }else{
            res.redirect('/');
        }
    },
};