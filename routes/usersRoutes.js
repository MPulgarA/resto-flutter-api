const UsersController = require('./../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {
    app.get('/api/users/getAll', UsersController.getAll);
    app.get('/api/users/findById/:id', passport.authenticate('jwt', { session: false }), UsersController.findById);
    app.get('/api/users/getAdminsNotificationTokens', passport.authenticate('jwt', { session: false }), UsersController.getAdminsNotificationTokens);

    // este es el bueno
    // app.post('/api/users/create', upload.array('image', 1), UsersController.registerWithImage);
    app.post('/api/users/create', UsersController.register);
    app.post('/api/users/login', UsersController.login);
    app.post('/api/users/login', UsersController.logout);

    // Actualizar datos
    app.put('/api/users/update', passport.authenticate('jwt', { session: false }), upload.array('image', 1), UsersController.update);
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt', { session: false }), UsersController.updateNotificationToken);

    app.get('/api/users/findDeliveryMan', passport.authenticate('jwt', { session: false }), upload.array('image', 1), UsersController.findDeliveryMan);
};

