const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const Keys = require('./../config/keys');
const Rol = require('./../models/rol');
const storage = require('./../utils/cloud_storage');

module.exports = {
    async getAll(req, res, next) {
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
    async findById(req, res, next) {
        try {
            const { id } = req.params
            const data = await User.findUserId(id);
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
    async register(req, res, next) {
        try {
            const user = req.body;
            const data = await User.create(user);

            // Asignación de rol por defecto
            await Rol.create(data.id, 1)

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente, ahora inicia sesión',
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
    async registerWithImage(req, res, next) {
        try {
            const user = JSON.parse(req.body);
            console.log('Datos enviados', user);


            const files = req.files;

            if (files.length > 0) {
                // nombre del archivo a almacenar
                const pathImage = `image_${Date.now()}`;
                const url = await storage(files[0], pathImage);

                if (url != undefined && uel != null) {
                    user.image = url;
                };
            };

            const data = await User.create(user);

            // Asignación de rol por defecto
            await Rol.create(data.id, 1)

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente, ahora inicia sesión',
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
    async update(req, res, next) {
        try {
            const user = JSON.parse(req.body);
            console.log('Datos enviados', user);


            const files = req.files;

            if (files.length > 0) {
                // nombre del archivo a almacenar
                const pathImage = `image_${Date.now()}`;
                const url = await storage(files[0], pathImage);

                if (url != undefined && uel != null) {
                    user.image = url;
                };
            };

            await User.update(user);

            return res.status(201).json({
                success: true,
                message: 'El usuario se ha actualizado correctamente',
            })
        } catch (error) {
            console.log('Error ', error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error en la actualización del usuario',
                error
            });
        }
    },
    async logout(req, res, next) {
        try {
            const {id} = req.body;
            await User.updateToken(id, null);
            return res.status(201).json({
                success: true,
                message: 'La sesión se ha cerrado correctamente',
            })

        } catch (error) {
            console.log('Error ', error);
            return res.status(501).json({
                success: false,
                message: 'Error al cerrar sesión',
                error
            });
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);
            console.log(user)
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'El correo no fue encontrado'
                })
            };

            if (User.isPasswordMatch(password, user.password)) {
                const token = jwt.sign({ id: user.id, email: user.id }, Keys.secretOrKey, {
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
                    session_token: `JWT ${token}`,
                    roles: user.roles
                };

                await User.updateToken(user.id, `JWT ${token}`);

                return res.status(201).json({
                    success: true,
                    message: 'Login exitoso',
                    data
                });
            } else {
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