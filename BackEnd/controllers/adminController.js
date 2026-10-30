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

const getUsersByInterest = async (req, res) => {
    try {
        const result = await User.aggregate([
            // Stage 1: $unwind takes an array (like ['Coding', 'Gaming']) and splits 
            // the document into multiple documents—one for each individual interest.
            { $unwind: '$interests' },

            // Stage 2: $group gathers those individual rows by interest name (_id), 
            // counts them ($sum: 1), and builds an array of user details.
            {
                $group: {
                    _id: '$interests',
                    totalUsers: { $sum: 1 },
                    users: { 
                        $push: { 
                            id: '$_id', 
                            name: '$name', 
                            email: '$email' 
                        } 
                    }
                }
            },

            // Stage 3: $sort organizes the results so the most popular interests appear first (-1 = descending).
            { $sort: { totalUsers: -1 } }
        ]);

        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsersWithNotes };