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
        email : "string"
    }
};
