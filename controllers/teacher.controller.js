const GroupModel = require('../models/GroupModel');
const SubjectModel = require('../models/SubjectModel');
const LessonModel = require('../models/LessonModel');
const TeacherController = {};


TeacherController.Auth = (req, res, next) =>
{
    if (req.user.type !== 1) return res.status(403).send({message: 'Usted no tiene autorización para esta ruta'});
    next();
};


TeacherController.getGroups = async (req, res) =>
{
    const data_groups = await GroupModel.find({_idteacher: req.user._id});
    let groups = [];
    for (let group of data_groups)
    {
        let { name } = await SubjectModel.findById(group._idsubject);
        groups.push({name, code:group.code, number:group.number});
    }

    res.status(200).json(groups);
};


TeacherController.getGroupStudents = async (req, res) =>
{
    let { code } = req.params;
    let group = await GroupModel.findOne({code:code});
    res.status(200).json(group.students);
};


TeacherController.NewLesson = async (req, res) =>
{
    let { groupCode, title} = req.body;
    let code = await LessonModel.find().count() + 1;
    let lesson = new LessonModel({
        title,
        code
    });
    lesson.save().then(
        async ()=>
        {
            await GroupModel.updateOne({code: groupCode},
            {$push:{lessons: lesson._id.toString()}}
            );
            res.status(200).send({message: 'Lección creada con exito', lessonCode: lesson.code});
        }
    ).catch(
        (error)=>
        {
            console.log(error);
            res.status(500).send({message:'ha ocurrio un error al guardar la lección'});
        }
    );
};


TeacherController.getLesson = async (req, res)=>
{
    let { code } = req.params;
    LessonModel.findOne({code}).then(
        ({title, finish_date})=>
        {
            res.status(200).json({title,finish_date});
        }
    ).catch(
        (error) =>
        {
            res.status(403).send({message:'Lección no encontrada'});
        }
    )
};


TeacherController.EndLesson = async(req, res) =>
{
    let {students, code} = req.body;
    let assisted = [];
    let not_assisted = [];
    for (let student of students)
    {
        if (student.assisted)
        {
            assisted.push({_id:student._id, name:student.name, code:student.code});
        }else not_assisted.push(student);
    }

    await LessonModel.updateOne({code},{
        $set:{assisted,not_assisted,finish_date: Date.now()}
    });

    res.status(200).send({message:'Asistencia guardada con exito'});
};


module.exports = TeacherController;