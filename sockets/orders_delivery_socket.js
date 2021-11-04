module.exports = (io) =>{
    const orderDeliveryNamespace = io.of('/orders/delivery');
    orderDeliveryNamespace.on('connection', function(){
        console.log('El usuario se conecto');

        socket.on('position', function(data){
            console.log('EMIT ', JSON.stringify(data));
            orderDeliveryNamespace.emit(`position/${data.id_order}`, {lat: data.lat, lng: data.lng});
        });

        socket.on('disconnect', function(data){
            console.log('Usuario desconectado')
        });

    });
};