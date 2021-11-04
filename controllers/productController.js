const Product = require('./../models/product');
// Con este se pueden almacenar varias imagenes
const asyncForEach = require('./../utils/async_foreach');
const storage = require('./../utils/cloud_storage');

module.exports = {
    async create(req, res, next) {
        let product = JSON.parse(req.body.product);

        console.log(JSON.stringify(product));

        const files = req.files;

        let inserts = 0;

        if (files.length === 0) {
            return res.status(501).json({
                message: 'Error al registrar el producto, no tiene imagen',
                success: false
            });
            
        } else {
            try {
                const data = await Product.create(product);
                product.id = data.id;

                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const pathImage = `image_${Date.now()}`;
                        const url = await storage(file, pathImage);

                        if (url !== undefined && url !== null) {
                            if (inserts == 0) product.image1 = url;
                            if (inserts == 1) product.image2 = url;
                            if (inserts == 2) product.image3 = url;

                            // if(inserts == 0){
                            //     product.image1 = url;
                            // }else if(inserts == 1){
                            //     product.image2 = url;
                            // }else if(inserts == 2){
                            //     product.image3 = url;
                            // }
                        };

                        await Product.update(product);
                        inserts += 1;

                        if (inserts == files.length) {
                            return res.status(201).json({
                                success: true,
                                message: 'El producto se ha registrado correctamente'
                            });
                        };

                    });
                };

                start();

            } catch (error) {
                console.log(error);
                return res.status(501).json({
                    message: 'Error al registrar el producto',
                    success: false,
                    error
                });
            };
        };
    },
    async findByCategory(req, res, next) {
        try {
            const {id_category} = req.params;
            const data = await Product.findByCategory(id_category);
            return res.status(201).json(data);
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                message: 'Error al listar los productos',
                success: false,
                error
            });
        }
    },
};