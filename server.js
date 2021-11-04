const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const passport = require('passport');
const io = require('socket.io')(server);
const mercadopago = require('mercadopago');


// Mercado pago
mercadopago.configure({
    access_token : 'TEST-6423076169469888-110413-50a66e858b9607869cf0a939c16ba76a-165732357'
});

// Socket.io
const orderDeliverySocket = require('./sockets/orders_delivery_socket');


// Inicializar firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});

// Rutas
const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const address = require('./routes/addressRoutes');
const products = require('./routes/productRoutes');
const orders = require('./routes/ordersRoutes');
const mercadoPagoRoute = require('./routes/mercadoPagoRoutes');


const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


app.disable('x-powered-by');

app.set('port', port);

// llamado de socket
orderDeliverySocket(io);

// Llamado a las rutas
users(app, upload);
categories(app);
products(app, upload);
address(app);
orders(app);
mercadoPagoRoute(app);

server.listen(3000, 'localhost', function(){
    console.log('Aplicación de nodejs', + process.pid + ' iniciada')
});

app.get('/', (req, res)=>{
    res.send('Flutter');
});

app.use((err, req, res, next)=>{
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app,
    server
};