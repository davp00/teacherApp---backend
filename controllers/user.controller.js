const UserController = {};
const UserModel = require('../models/UserModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt-nodejs');
const TokenController = require('./jwt.controller');
const { URL_FRONT } = require('../config');


UserController.Create = async (req, res) =>
{
    let newUser = new UserModel(req.body),
        email   = new RegExp([newUser.email].join(""), 'i') ,
        query   = {email};

    if ( await UserModel.find(query).count() === 0 )
    {
        newUser.pass = bcrypt.hashSync(newUser.pass, bcrypt.genSaltSync(8), null);
        await newUser.save();
        res.status(200).send({message: 'Usuario creado con exito.'});
    }else
    {
        res.status(403).send({message: 'Ya hay un usuario existente con este correo'});
    }
};

UserController.ProfileInfo = async ( req, res ) =>
{
    let { _id }     = req.user,
        user        = await UserModel.findById(_id, { pass:0, groups:0, creation_date:0 , _id: 0});

    res.status(200).json(user);
};


UserController.Login = async (req, res) =>
{
    let user = req.body;
    user.email = new RegExp([user.email].join('i'), 'i');

    let found_user = await UserModel.findOne({email:user.email});

    if ( found_user )
    {
        if ( bcrypt.compareSync(user.pass, found_user.pass) )
        {

            let { _id, type, name} = found_user;
            let tokenData = {_id, type};
            let token = TokenController.Create(tokenData,2,'days');
            res.status(200).send({token, name, type});

        }else res.status(403).send({message: 'Contraseña incorrecta.'});

    }else
    {
        res.status(403).send({message: 'Correo no coincide con ningun usuario.'});
    }
    
};


UserController.PasswordRecovery = async (req, res)=>
{
    let email = new RegExp([req.body.email].join(''),'i');
    let user = await UserModel.findOne({email});

    if (!user)
    {
        res.status(403).send({message: 'El correo no existe en los registros.'});
        return ;
    }

    let token = TokenController.Create({_id: user._id}, 2, 'days');

    user.recovery_token = token;
    await user.save();

    let html = `Para recuperar su contraseña ingrese al siguente link
        <a href="${URL_FRONT+'/recovery/'+token}">Recuperar</a>.<br><br><br>
        <strong>NOTA:</strong> No revisamos este buzón, así que no respondas a este mensaje. 
        Si tienes una pregunta, ve a <a href="#">Ayuda y contacto.</a>
    `;

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'no.replyteacherapp@gmail.com',
            pass: 'Perro123'
        }
    });

    let mailOptions = {
        from:'TeacherApp <no.replyteacherapp@gmail.com>',
        to: req.body.email,
        subject: 'Recuperar contraseña TeacherApp',
        html
    };

    transporter.sendMail(mailOptions, (error, info) =>
    {
        if (error) res.status(404).send({message: 'Ocurrio un error al enviar el correo'});
        else res.status(200).send({message: 'Un vinculo fue enviado a su correo para recuperar contraseña'});
    });
};


UserController.ValidateRecoveryToken = async ( req , res ) =>
{
    let token       = req.headers.authorization.split(" ")[1],
        { _id }     = req.user,
        user        = await UserModel.findById(_id);

    if ( user.recovery_token === token)
        res.status(200).send({message: 'Token Activo'});
    else
        res.status(403).send({message: 'Ya has recuperado tu contraseña desde este url'})

};


UserController.ChangePassword = async (req, res)=>
{
    let { _id } = req.user;
    let { pass } = req.body;
    pass = bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);

    await UserModel.findByIdAndUpdate(_id, {$set:{pass, recovery_token: ""}});
    res.status(200).json({message: 'Contraseña cambiada con exito'});
};


module.exports = UserController;