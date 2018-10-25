const GroupModel = require('../models/GroupModel');
const SubjectModel = require('../models/SubjectModel');
const UserModel = require('../models/UserModel');
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


module.exports = TeacherController;