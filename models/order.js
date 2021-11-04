const db = require('./../config/config');

const Order = {};

Order.create = (order) => {
    const sql = `INSERT INTO orders (
        id_client, 
        id_address, 
        status, 
        timestamp, 
        created_at, 
        updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;

    return db.oneOrNone(sql, [
        order.id_client,
        order.id_address,
        order.status,
        Date.now(),
        new Date(),
        new Date()
    ]);
};

Order.findByStatus = (status) => {
    const sql = `SELECT 
                o.id, 
                o.id_client, 
                o.id_address, 
                o.id_delivery, 
                o.status, 
                o.timestamp,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', p.id,
                        'name', p.name, 
                        'description', p.description, 
                        'price', p.price, 
                        'image1', p.image1, 
                        'image2', p.image2, 
                        'image3', p.image3, 
                        'quantity', ohp.quantity
                    )
                ) as products,
                JSON_BUILD_OBJECT(
                    'id', u.id,
                    'name', u.name, 
                    'lastname', u.lastname, 
                    'image', u.image
                ) AS client,
                    JSON_BUILD_OBJECT(
                    'id', u2.id,
                    'name', u2.name, 
                    'lastname', u2.lastname, 
                    'image', u2.image
                ) AS delivery,
                JSON_BUILD_OBJECT(
                    'id', a.id,
                    'address', a.address, 
                    'neighborhood', a.neighborhood, 
                    'lat', a.lat,
                    'lng', a.lng
                ) AS address
            FROM 
                orders as o
            INNER JOIN 
                users as u
            ON
                o.id_client=u.id
            LEFT JOIN 
                users as u2
            ON
                o.id_delivery = u2.id
            INNER JOIN 
                address as a
            ON 
                a.id=o.id_address
            INNER JOIN
                orders_has_products as ohp
            ON
                ohp.id_order = o.id
            INNER JOIN
                products as p
            ON 
                p.id = ohp.id_product
            WHERE 
                status = $1
            GROUP BY
                o.id, u.id, a.id, u2.id`;

    return db.manyOrNone(sql, status);
};


Order.findByDeliveryAndStatus = (id_delivery, status) => {
    const sql = `SELECT 
                o.id, 
                o.id_client, 
                o.id_address, 
                o.id_delivery, 
                o.status, 
                o.timestamp,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', p.id,
                        'name', p.name, 
                        'description', p.description, 
                        'price', p.price, 
                        'image1', p.image1, 
                        'image2', p.image2, 
                        'image3', p.image3, 
                        'quantity', ohp.quantity
                    )
                ) as products,
                JSON_BUILD_OBJECT(
                    'id', u.id,
                    'name', u.name, 
                    'lastname', u.lastname, 
                    'image', u.image
                ) AS client,
                    JSON_BUILD_OBJECT(
                    'id', u2.id,
                    'name', u2.name, 
                    'lastname', u2.lastname, 
                    'image', u2.image
                ) AS delivery,
                JSON_BUILD_OBJECT(
                    'id', a.id,
                    'address', a.address, 
                    'neighborhood', a.neighborhood, 
                    'lat', a.lat,
                    'lng', a.lng
                ) AS address
            FROM 
                orders as o
            INNER JOIN 
                users as u
            ON
                o.id_client=u.id
            LEFT JOIN 
                users as u2
            ON
                o.id_delivery = u2.id
            INNER JOIN 
                address as a
            ON 
                a.id=o.id_address
            INNER JOIN
                orders_has_products as ohp
            ON
                ohp.id_order = o.id
            INNER JOIN
                products as p
            ON 
                p.id = ohp.id_product
            WHERE 
                o.id_delivery = $1 AND status = $2 
            GROUP BY
                o.id, u.id, a.id, u2.id`;

    return db.manyOrNone(sql, id_delivery, status);
};


Order.findByClientAndStatus = (id_client, status) => {
    const sql = `SELECT 
                o.id, 
                o.id_client, 
                o.id_address, 
                o.id_delivery, 
                o.status, 
                o.timestamp,
                o.lat,
                o.lng,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', p.id,
                        'name', p.name, 
                        'description', p.description, 
                        'price', p.price, 
                        'image1', p.image1, 
                        'image2', p.image2, 
                        'image3', p.image3, 
                        'quantity', ohp.quantity
                    )
                ) as products,
                JSON_BUILD_OBJECT(
                    'id', u.id,
                    'name', u.name, 
                    'lastname', u.lastname, 
                    'image', u.image
                ) AS client,
                    JSON_BUILD_OBJECT(
                    'id', u2.id,
                    'name', u2.name, 
                    'lastname', u2.lastname, 
                    'image', u2.image
                ) AS delivery,
                JSON_BUILD_OBJECT(
                    'id', a.id,
                    'address', a.address, 
                    'neighborhood', a.neighborhood, 
                    'lat', a.lat,
                    'lng', a.lng
                ) AS address
            FROM 
                orders as o
            INNER JOIN 
                users as u
            ON
                o.id_client=u.id
            LEFT JOIN 
                users as u2
            ON
                o.id_delivery = u2.id
            INNER JOIN 
                address as a
            ON 
                a.id=o.id_address
            INNER JOIN
                orders_has_products as ohp
            ON
                ohp.id_order = o.id
            INNER JOIN
                products as p
            ON 
                p.id = ohp.id_product
            WHERE 
                o.id_client = $1 AND status = $2 
            GROUP BY
                o.id, u.id, a.id, u2.id`;

    return db.manyOrNone(sql, id_client, status);
};

Order.update = (order) => {
    const sql = ` 
    UPDATE orders set 
            id_client = $2, 
            id_address = $3,
            id_delivery = $4, 
            status = $5, 
            updated_at = $6
        WHERE 
            id = $1
        `;
    return db.none(sql, [
        order.id,
        order.id_client,
        order.id_address,
        order.id_delivery,
        order.status,
        new Date()
    ]);
};

Order.updateLatLng = (order) => {
    const sql = ` 
    UPDATE orders set 
            lat = $2, 
            lng = $3
        WHERE 
            id = $1
        `;
    return db.none(sql, [
        order.id,
        order.lat,
        order.lng,
    ]);
};

module.exports = Order;

