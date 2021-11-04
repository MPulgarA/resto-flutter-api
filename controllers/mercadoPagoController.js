const mercadopago = require('mercadopago');
const Order = require('./../models/order');
const OrderHasProducts = require('./../models/order_has_products');
const User = require('./../models/user');

mercadopago.configure({
    sandbox: true,
    access_token: 'TEST-6423076169469888-110413-50a66e858b9607869cf0a939c16ba76a-165732357'
});

module.exports = {
    async createPaymentCreditCard(req, res, next){
        let payment = req.body;
        const payment_data = {
            description: payment.description,
            transaction_amount: payment.transaction_amount,
            installments: payment.installments,
            payment_method_id: payment.payment_method_id,
            token: payment.token,
            issuer_id: payment.issuer_id,
            payer:{
                email: payment.payer.email,
                identification: {
                    type: payment.payer.identification.type,
                    number: payment.payer.identification.number,
                }
            }
        };

        try {
            const data = await mercadopago.payment.create(payment_data);
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                message: 'Error al crear el pago',
                success: false,
                error
            });
        }

        if(data){
            console.log('Datos correctos');
            if(data !== undefined){
                const payment_type_id = module.exports.validatePaymentMethod(payment.payment_type_id);
                payment.id_payment_method = payment_type_id;

                let order = payment.order;
                order.status = 'PAGADO';
                const info = await Order.create(order);
    
                // Recorrer todos los productos agregados a la orden
                for (const product of order.products) {
                    await OrderHasProducts.create(info.id, product.id, product.quantity);
                };
    
                return res.status(201).json(data.response);
            };
        }else{
            return res.status(501).json({
                message: 'Error en algun dato de la petición',
                success: false
            });
        }
        
    },
    validatePaymentMethod(status){
        if(status == 'credit_cart'){
            status = 1;
        }
        if(status == 'bank_transfer'){
            status = 2;
        }
        if(status == 'ticket'){
            status = 3;
        }
        if(status == 'upon_delivery'){
            status = 4;
        }

        return status;
    }
}