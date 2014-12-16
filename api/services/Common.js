var sendgrid = require('sendgrid')('jafetgonzalez','chachach1');
//envia actualizaciones de viajes
module.exports.sendViajeUpdate = function(viaje){
    Funcionario.findOne({ id : viaje.funcionario }).exec(function(err,funcionario) {
        Subscription.find({ funcionario : viaje.funcionario}).exec(function(err,subscriptions) {
            var mail = new sendgrid.Email({
                from: 'contact@viajesclaros.com',
                subject: 'Nuevo viaje de ' + funcionario.nombre_completo,
                text: 'Checalo aqui : http://viajestransparentes.node.spaceshiplabs.com/viaje?id=' + viaje.id
            });
            _.forEach(subscriptions,function(subscription){
                mail.addTo(subscription.email);
            });
            this.sendEmail(mail);
        });
    });
};
//envia actualizaciones de datos
module.exports.sendFuncionarioUpdate = function(funcionario) {
    Subscription.find({ funcionario : funcionario.id}).exec(function(err,subscriptions) {
        var mail = new sendgrid.Email({
            from: 'contact@viajesclaros.com',
            subject: 'Actualizacion de datos de ' + funcionario.nombre_completo,
            text: 'Checalo aqui : http://viajestransparentes.node.spaceshiplabs.com/funcionario?id=' + funcionario.id
        });
        _.forEach(subscriptions,function(subscription){
            mail.addTo(subscription.email);
        });
        this.sendEmail(mail);
    });
};

module.exports.sendEmail = function(email,cb) {
    sendgrid.send(email, function(err, json) {
        if (err) { return console.error(err); }
        cb();
    });
};

module.exports.sendNewEmail = function(funcionario,subscription,cb) {
    var mail = new sendgrid.Email({
        to: subscription.email,
        from: 'contact@viajesclaros.com',
        subject: 'confirmacion de subscripcion',
        text: 'Hola estas subscrito a las actualizaciones de viajes del funcionario ' + funcionario.nombre_completo
    });
    this.sendEmail(mail,cb);
};

module.exports.viajesRequestToString = function(request) {
    if (!_.isUndefined(request)){
        return "test definido";
    }
    return "test no definido";
};