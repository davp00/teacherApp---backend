const StudentController = {};
const fs                = require('fs');
const { SendMail }      = require('./mail.controller');
const UserModel         = require('../models/UserModel');
const GroupModel        = require('../models/GroupModel');
const SubjectModel      = require('../models/SubjectModel');
const FileModel         = require('../models/FileModel');
const LessonModel       = require('../models/LessonModel');

StudentController.Auth = (req, res, next)=>
{
    if (req.user.type !== 2)return res.status(403).send({message: 'Usted no tiene autorización para esta ruta'});
    next();
};

StudentController.getGroups = async (req, res)  =>
{
    let student      = await UserModel.findById(req.user._id),
        groups       = await GroupModel.find({_id: { $in: student.groups }}, {students: 0, lessons:0, _id: 0}),
        teacher,
        subject,
        studentGroups = [];

    for (let group of groups)
    {
        teacher = await UserModel.findById(group._idteacher, {name:1, _id: 0});
        subject = await SubjectModel.findById(group._idsubject, {name:1, _id: 0});
        let { code , number } = group;
        studentGroups.push({subject, teacher, code, number});
    }

    res.status(200).json(studentGroups);
};


StudentController.getLessons = async ( req, res ) =>
{
    let { groupCode }   = req.params;
    let group           = await GroupModel.findOne({code:groupCode}),
        lessons         = await LessonModel.find({_id: {$in: group.lessons}}, {title: 1, finish_date: 1, code:1, _id: 0});

    res.status(200).json(lessons);
};


StudentController.SendExcuse = async ( req, res ) =>
{
    let urlHost = req.headers.host;
    let { fileExcuse }                  = req.files,
        extension                       = fileExcuse.originalFilename.split('.').pop(),
        {groupCode, lesson, message}    = req.body,
        lessonInfo                      = await LessonModel.findOne({code:Number(lesson)}, {name:1 , finish_date:1});

    let user = await UserModel.findById(req.user._id),
        group = await GroupModel.findOne({code: groupCode}),
        subject = await SubjectModel.findById(group._idsubject, {name: 1}),
        teacher = await UserModel.findById(group._idteacher, {name: 1, email: 1}),
        newFile = new FileModel({
            _idUser: req.user._id,
            extension
        });

    await newFile.save();
    let newFileName = newFile._id.toString() + '.' + extension;

    fs.renameSync(fileExcuse.path,`./public/files/${ newFileName }`);
    newFileName = urlHost + '/files/'+ newFileName;
    let html = `
        El estudiante ${ user.name } de el grupo ${ group.number } de la materia ${ subject.name } <br>
        Ha enviado una excusa de la clase ${lessonInfo.title} en la fecha ${ lessonInfo.finish_date }. Ingrese a <a href='${ newFileName }'><strong>Ver Excusa</strong></a> para poder verla<br>
        Mensaje de ${ user.name }: <br>
        <strong>${message}</strong>
    `;

    SendMail(teacher.email,'Excusa enviada por estudiante', html, function (error, info) {
        if (error) res.status(404).send({message: 'Ha ocurrido un error al enviar el correo'});
        else res.status(200).send({message: 'Su excusa fue enviada con exito'});
    });
};


module.exports = StudentController;