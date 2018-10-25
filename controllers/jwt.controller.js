const jwt = require('jwt-simple');
const moment = require('moment');
const { SECRET_TOKEN } = require('../config');
const TokenController = {};


TokenController.Create = (data, num, time) =>
{
    const payload = {
        sub:data,
        iat: moment().unix(),
        exp: moment().add(num, time).unix
    };

    return jwt.encode(payload, SECRET_TOKEN);
};


TokenController.Decode = (token) =>
{
    return new Promise(
        (resolve, reject) => 
        {
            try {
                const payload = jwt.decode(token, SECRET_TOKEN);
                if (payload.exp <= moment().unix()) // Si el token expiró
                {
                    reject( // devuelvo error
                        {
                            status:401,
                            message: 'Su sesión ha caducado'
                        }
                    );
                }
                resolve(payload.sub);
            }catch (error) {
                reject(
                    {
                        status:500,
                        message: 'Autorización no valida'
                    }
                );
            }
        }
    );
};


TokenController.isAuth = (req, res, next) =>
{
    if (!req.headers.authorization) return res.status(403).send({message: 'No tienes autorización'});

    const token = req.headers.authorization.split(" ")[1];
    TokenController.Decode(token).then(
        (data)=>
        {
            req.user = data;
            next();
        }
    ).catch(
        (error) =>
        {
            return res.status(error.status).send({message: error.message});
        }
    );
};

module.exports = TokenController;