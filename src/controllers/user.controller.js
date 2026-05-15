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
    const { id } = req.params
    // 1. Basic validation
    if (!id) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    // 2. Check for existing user
    const existingUser = await User.findOne({ _id: id });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 3. Delete user
    await User.deleteOne({ _id: id });

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
    const { id } = req.params;
    const { columnName, columnValue } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    if (!columnName || !columnValue) {
      return res.status(400).json({
        message: "Missing columnName or columnValue"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { [columnName]: columnValue }, // ✅ FIXED
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    console.log('UPDATED:', updatedUser);

    res.json({
      message: "User updated successfully ✅",
      data: updatedUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update user",
      error: error.message
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // 2. Check for existing user
    const existingUser = await User.findOne({ email });
    if (!existingUser || existingUser.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 3. Send response
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to login",
      error: error.message
    });
  }
}
