const db = require('./../config/config');
const crypto = require('crypto');

const User = {};

User.getAll = () =>{
    const sql = `select * from users`;
    return db.manyOrNone(sql);
};

User.create = (user) =>{

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
    const sql = `select id, email, name, lastname, image, phone, password, session_token from users where id = $1`;
    return db.oneOrNone(sql, id).then(user => callback(null, user));
};

User.findByEmail = (email) => {
    const sql = `select id, email, name, lastname, image, phone, password, session_token from users where email = $1`;
    return db.oneOrNone(sql, email);
};

User.isPasswordMatch = (userPassword, hash) => {
    const mypasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    if(mypasswordHashed === hash){
        return true;
    }else{
        return false;
    }
};

module.exports = User; 