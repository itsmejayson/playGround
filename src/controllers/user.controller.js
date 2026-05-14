const User = require("../models/user.model");

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};


exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    // 2. Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    // 3. Create user
    const user = await User.create({ name, email, password });

    // 4. Send response
    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    // 1. Basic validation
    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    // 2. Check for existing user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 3. Delete user
    await User.deleteOne({ email });

    // 4. Send response
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { columnName, email, columnValue } = req.body;

    // 1. Basic validation
    if (!email || !columnValue || !columnName) {
      return res.status(400).json({
        message: "Email, column value, and column name are required"
      });
    }

    // 2. Check for existing user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 3. Update user
    existingUser[columnName] = columnValue;
    await existingUser.save();

    // 4. Send response
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message
    });
  }
};
