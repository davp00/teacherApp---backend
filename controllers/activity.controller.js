const ActivityController    = {};
const ActivityModel         = require('../models/ActivityModel');
const UserModel             = require('../models/UserModel');
const GroupModel            = require('../models/GroupModel');

ActivityController.get = async ( req , res ) =>
{
    let { groupCode }       = req.params;
    let activities          = await ActivityModel.find({groupCode}, {_id: 0, finish_date: 0});

    res.status(200).json({ activities });
};


module.exports = ActivityController;