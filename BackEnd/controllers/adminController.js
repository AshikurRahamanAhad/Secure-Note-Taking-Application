const User = require('..models/userModel');
const mongoose = require('mongoose');

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
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

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({  message: 'Not found.' });
    res.status(200).json({ message: 'User removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { getAllUsers, deleteUser }