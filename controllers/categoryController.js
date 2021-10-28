const Category = require('./../models/category');

module.exports = {
    async create (req,res,next){
        try {
            const category = req.body;
            console.log(category);
            const data = await Category.create(category);
            return res.status(201).json({
                message: '',
                success: true,
                data: data.id
            });
        } catch (error) {
            console.log(eror);
            return res.status(401).json({
                message:'Hubo un error al crear la categoria',
                success: false,
                error
            });
        }
    }
}