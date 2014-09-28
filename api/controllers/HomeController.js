/**
 * HomeController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
module.exports = {
	index : function(req,res){
        res.view();
	},

    vajesJson : function(req,res) {
        Viaje.find().exec(function(e,viajes) {
            if (e) res.json({ text : "error",error : e });
            res.json(viajes);
        });
    }
};