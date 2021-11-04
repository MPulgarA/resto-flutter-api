const ProductController = require('./../controllers/productController');
const passport = require('passport');

module.exports = (app, upload) =>{
    app.post('/api/products/create', passport.authenticate('jwt', { session: false }), upload.array('image', 1), ProductController.create);
    app.get('/api/products/findByCategory/:id_category', passport.authenticate('jwt', { session: false }), ProductController.findByCategory);
    app.get('/api/products/findByCategoryAndProductName/:id_category/:product_name', passport.authenticate('jwt', { session: false }), ProductController.findByCategoryAndProductName);
};