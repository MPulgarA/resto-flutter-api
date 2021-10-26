const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const Keys = require('./../config/keys');

module.exports = {
    async getAll(req, res, next){
        try {
            const data = await User.getAll();
            console.log(data);
            return res.status(200).json(data);
        } catch (error) {
            console.log('Error ', error);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },
    async register(req, res, next){
        try {
            const user = req.body;
            const data = await User.create(user);
            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data.id
            })
        } catch (error) {
             console.log('Error ', error);
             return res.status(500).json({
                 success: false,
                 message: 'Error al registrar el usuario',
                 error
             });
        }
    },
    async login(req, res, next){
        try {
            const {email, password} = req.body;
            const user = await User.findByEmail(email);
            console.log(user)
            if(!user){
                return res.status(401).json({
                    success: false,
                    message: 'El correo no fue encontrado'
                })
            };

            if(User.isPasswordMatch(password, user.password)){
                const token = jwt.sign({id: user.id, email: user.id}, Keys.secretOrKey, {
                    // 1 hora
                    // expiresIn : (60*60*24)
                });

                const data = {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    phone: user.phone,
                    image: user.image,
                    session_token: `JWT ${token}`
                }

                return res.status(201).json({
                    success: true,
                    data
                });
            }else{
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta'
                });
            };

        } catch (error) {
            console.log('Error ', error);
            return res.status(501).json({
                success: false,
                message: 'Error al iniciar sesión',
                error
            }); 
        }
    },
};