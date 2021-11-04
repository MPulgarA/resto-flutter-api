const Order = require('./../models/order');
const OrderHasProducts = require('./../models/order_has_products');

module.exports = {
    async create(req, res, next) {
        try {
            let order = req.body;
            const data = await Order.create(order);

            // Recorrer todos los productos agregados a la orden
            for (const product of order.products) {
                await OrderHasProducts.create(data.id, product.id, product.quantity);
            };

            return res.status(201).json({
                success: true,
                message: 'La orden se creo correctamente',
                data: data.id,
            });

        } catch (error) {
            console.log(error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error
            });
        }
    },
    async findByStatus(req, res, next) {
        try {
            const { status } = req.params;
            const data = await Order.findByStatus(status);
            return res.status(201).json(data);
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las ordenes por estado',
                success: false,
                error
            });
        }
    },
    async findByDeliveryAndStatus(req, res, next) {
        try {
            const { id_delivery, status } = req.params;
            const data = await Order.findByDeliveryAndStatus(id_delivery, status);
            return res.status(201).json(data);
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las ordenes por estado',
                success: false,
                error
            });
        }
    },
    async findByClientAndStatus(req, res, next) {
        try {
            const { id_client, status } = req.params;
            const data = await Order.findByClientAndStatus(id_client, status);
            return res.status(201).json(data);
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las ordenes por cliente',
                success: false,
                error
            });
        }
    },
    async updateToDispatched(req, res, next) {
        try {
            let order = req.body;
            order.status = 'DESPACHADO';
            await Order.update(order);

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
                data: data.id,
            });

        } catch (error) {
            console.log(error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error actualizando la orden',
                error
            });
        }
    },
    async updateToOnTheWay(req, res, next) {
        try {
            let order = req.body;
            order.status = 'EN CAMINO';
            await Order.update(order);

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
                data: data.id,
            });

        } catch (error) {
            console.log(error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error actualizando la orden',
                error
            });
        }
    },
    async updateToDelivered(req, res, next) {
        try {
            let order = req.body;
            order.status = 'ENTREGADO';
            await Order.update(order);

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
                data: data.id,
            });

        } catch (error) {
            console.log(error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error actualizando la orden',
                error
            });
        }
    },
    async updateLatLng(req, res, next) {
        try {
            let order = req.body;
            await Order.updateLatLng(order);

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
                data: data.id,
            });

        } catch (error) {
            console.log(error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error actualizando la orden',
                error
            });
        }
    },
};