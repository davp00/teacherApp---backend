const TeacherController = {};
const GroupModel        = require('../models/GroupModel');
const SubjectModel      = require('../models/SubjectModel');
const LessonModel       = require('../models/LessonModel');
const UserModel         = require('../models/UserModel');
const ActivityModel     = require('../models/ActivityModel');


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
    let { code }    = req.params;
    let group       = await GroupModel.findOne({code:code});
    let students    = await UserModel.find({_id: { $in : group.students }},{ groups:0, pass: 0, creation_date: 0, email: 0});
    res.status(200).json(students);
};


TeacherController.NewLesson = async (req, res) =>
{
    let { groupCode, title}     = req.body,
        code                    = await LessonModel.find().countDocuments() + 1,
        lesson                  = new LessonModel( { title, code } );

    await lesson.save();
    console.log(groupCode)
    await GroupModel.updateOne({code: groupCode},
        {   $push:{ lessons: lesson._id.toString() }  }
    );
    res.status(200).send({message: 'Lección creada con exito', lessonCode: lesson.code});
};


TeacherController.getLesson = async (req, res)=>
{
    let { code } = req.params;
    LessonModel.findOne({code}).then(
        ( { title, finish_date } )=>
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
            assisted.push(student._id);
        }else not_assisted.push(student._id);
    }

    await LessonModel.updateOne({code},{
        $set:{assisted,not_assisted,finish_date: Date.now()}
    });


    res.status(200).send({message:'Asistencia guardada con exito'});
};


FindStudent = (array , _id) =>
{
    
    for ( let element of array )
    {
        if ( element === _id)
        {
            let index = array.indexOf(element);
            array.splice(index, index);
            return true;
        }
    }

    return false;
};


SortByName = (a , b) =>
{
    if(a.name < b.name) { return -1;    }
    if(a.name > b.name) { return 1;     }
    return 0;
};


TeacherController.getGroupInformation = async ( req , res ) =>
{
    let { groupCode }   = req.params,
    group               = await GroupModel.findOne({ code: groupCode, _idteacher: req.user._id }),
    lessons             = await LessonModel.find({_id: { $in : group.lessons }} , {assisted: 0}),
    students            = await UserModel.find({_id: { $in : group.students }},{ groups:0, pass: 0, creation_date: 0, email: 0});

    for (let lesson of lessons)
    {
        for (let student of students)
        {
            if (! student.assistanceList ) { student.assistanceList = [];}
            student.assistanceList.push(!FindStudent(lesson.not_assisted, student._id.toString()));
        }
    }

    students.sort(SortByName);

    res.json({students, lessons});
    
};


TeacherController.newActivity = async ( req , res ) =>
{
    let code        = await ActivityModel.find().count() + 1 ;
    let { title, points, groupCode } = req.body;
    let newActivity = new ActivityModel({
        title,
        points,
        code,
        groupCode,
        _idteacher: req.user._id
    });

    await newActivity.save();
    res.status(200).json({activityCode: newActivity.code});
};


module.exports = TeacherController;