const User = require('../models/User');

const getUsersWithNotes = async (req, res) => {
    try {
        const result = await User.aggregate([
            {
        $lookup: {
          from: 'notes', localField: '_id',
          foreignField: 'userId', as: 'userNotes'
          }},

            { $project: {password: 0,adminCode: 0}}
        ]);

    res.status(200).json({ data: result });
    } 
    catch (error) 
    { res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsersWithNotes };