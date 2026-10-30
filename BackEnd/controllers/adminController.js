const User = requird('..models/userModel');
const mongoose = require('mongoose');

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.quiry.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit; 

    const users = await User.find().select('-password').skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { getAllUsers };