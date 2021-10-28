const ProductController = require('./../controllers/productController');
const passport = require('passport');

module.exports = (app, upload) =>{
    app.post('/api/products/create', passport.authenticate('jwt', { session: false }),upload.array('image', 3), ProductController.create);

}