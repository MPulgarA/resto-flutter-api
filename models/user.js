const db = require('./../config/config');
const crypto = require('crypto');

const User = {};

User.getAll = () => {
    const sql = `select * from users`;
    return db.manyOrNone(sql);
};

User.create = (user) => {

    const mypasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = mypasswordHashed;

    const sql = `INSERT INTO 
            users (
                email, 
                name, 
                lastname, 
                phone, 
                image,
                password,
                created_at, 
                updated_at
                ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
    return db.oneOrNone(sql, [
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        user.password,
        new Date(),
        new Date()
    ]);
};

User.findById = (id, callback) => {
    const sql = `
        SELECT 
            id, 
            email, 
            name, 
            lastname, 
            image, 
            phone, 
            password, 
            session_token,
            notification_token 
        from 
            users 
        where 
            id = $1`;
    return db.oneOrNone(sql, id).then(user => callback(null, user));
};

User.findByEmail = (email) => {
    // const sql = `select id, email, name, lastname, image, phone, password, session_token from users where email = $1`;
    const sql = `
    SELECT 
    u.id, u.email, u.name, u.lastname, u.image, u.phone, u.password, u.session_token, u.notification_token,
        json_agg(
            json_build_object(
            'id', r.id,
            'name', r.name,
            'image', r.image,
            'route', r.route
        ) 
    ) AS roles   
    FROM 
        users AS u
    INNER JOIN 
        user_has_role AS uhr
    ON 
        uhr.id_user = u.id
    INNER JOIN 
        roles AS r
    ON
        r.id = uhr.id_rol
    WHERE
        u.email = $1
    GROUP BY
        u.id             
    `;
    return db.oneOrNone(sql, email);
};

User.findUserId = (id) => {
    // const sql = `select id, email, name, lastname, image, phone, password, session_token from users where email = $1`;
    const sql = `
    SELECT 
    u.id, u.email, u.name, u.lastname, u.image, u.phone, u.password, u.session_token, u.notification_token ,
        json_agg(
            json_build_object(
            'id', r.id,
            'name', r.name,
            'image', r.image,
            'route', r.route
        ) 
    ) AS roles   
    FROM 
        users AS u
    INNER JOIN 
        user_has_role AS uhr
    ON 
        uhr.id_user = u.id
    INNER JOIN 
        roles AS r
    ON
        r.id = uhr.id_rol
    WHERE
        u.id = $1
    GROUP BY
        u.id             
    `;
    return db.oneOrNone(sql, id);
};

User.isPasswordMatch = (userPassword, hash) => {
    const mypasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    if (mypasswordHashed === hash) {
        return true;
    } else {
        return false;
    }
};

User.update = (user) => {
    const sql = `UPDATE  users SET name = $2, lastname = $3, phone = $4, image = $5, updated_at = $6 where id = $1`;
    return db.none(sql, [
        user.id,
        user.name,
        user.lastname, 
        user.phone, 
        user.image,
        new Date()
    ]);
};


User.updateToken = (id, token) => {
    const sql = `UPDATE  users SET session_token = $2 WHERE id = $1`;
    return db.none(sql, [
        id,
        token
    ]);
};

User.updateNotificationToken = (id, token) => {
    const sql = `UPDATE  users SET notification_token = $2 WHERE id = $1`;
    return db.none(sql, [
        id,
        token
    ]);
};

User.findDeliveryMan = () => {
    // const sql = `select id, email, name, lastname, image, phone, password, session_token from users where email = $1`;
    const sql = `
    SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.lastname, 
        u.image, 
        u.phone, 
        u.password, 
        u.session_token,
        u.notification_token 
    FROM  
        users AS u
    INNER JOIN    
        user_has_role AS uhr   
    ON
        uhr.id_user = u.id
    INNER JOIN 
        roles as r
    ON 
        r.id = uhr.id_rol
    WHERE 
        r.id = 3`;
    return db.manyOrNone(sql);
};

User.getAdminNotificationToken = () => {
    const sql = `
    SELECT 
        u.notification_token 
    FROM  
        users AS u
    INNER JOIN    
        user_has_role AS uhr   
    ON
        uhr.id_user = u.id
    INNER JOIN 
        roles as r
    ON 
        r.id = uhr.id_rol
    WHERE 
        r.id = 2`;
    return db.manyOrNone(sql);
};



module.exports = User; 