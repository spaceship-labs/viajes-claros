/**
 * Created by Owner on 9/30/2014.
 */
module.exports = {
    connection : 'mysql-connection',
    schema : true,
    tableName : 'subscripcion',
    attributes : {
        funcionario : {
            model : "funcionario"
        },
        email : "string",
        id : 'int'
    },
    afterCreate : function(subscription,cb){
        Funcionario.findOne({ id : subscription.funcionario }).exec(function(err,funcionario) {
            if (err) { return console.log(err);}
            Common.sendNewEmail(funcionario,subscription,cb);
        });
    }
};
