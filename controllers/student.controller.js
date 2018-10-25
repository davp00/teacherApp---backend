const StudentController = {};

StudentController.Auth = (req, res, next)=>
{
    if (req.user.type !== 2)return res.status(403).send({message: 'Usted no tiene autorización para esta ruta'});
    next();
};


module.exports = StudentController;