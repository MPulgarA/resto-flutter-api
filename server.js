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


// Inicializar firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});

// Rutas
const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoute');

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

// Llamado a las rutas
users(app, upload);
categories(app);

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