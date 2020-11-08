module.exports = function(app) {
    let userCtrl = require('./controller');

    app.route('/user/{:id}')
        .get(userCtrl.getUserByUserId)
        .put(userCtrl.updateUsers);
    app.route('/user/create')
        .post(userCtrl.createUser);

    app.route('/login')
        .post(userCtrl.login);
};